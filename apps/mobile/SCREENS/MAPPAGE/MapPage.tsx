import React, { useMemo, useState } from "react"
import { View, Text } from "react-native"
import Svg, { Polyline } from "react-native-svg"
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view"

import { CSUB_BOUNDARY } from "../../DATA/Boundary"
import { CSUB_BOUNDS } from "../../DATA/Campus"
import { latLngToXY } from "../../DATA/MapMath"

export function MapPage() {
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number } | null>(null)

  // A fixed "world" canvas that we zoom/pan inside (prevents cutting)
  const WORLD_W = 1600
  const WORLD_H = 1600
  const PAD = 80

  const pointsString = useMemo(() => {
    if (!canvasSize) return ""

    // Make sure boundary is closed (last point = first point)
    const boundary =
      CSUB_BOUNDARY.length > 0 &&
      (CSUB_BOUNDARY[0][0] !== CSUB_BOUNDARY[CSUB_BOUNDARY.length - 1][0] ||
        CSUB_BOUNDARY[0][1] !== CSUB_BOUNDARY[CSUB_BOUNDARY.length - 1][1])
        ? [...CSUB_BOUNDARY, CSUB_BOUNDARY[0]]
        : CSUB_BOUNDARY

    // Convert to normalized (0..1) points first
    const normalized = boundary.map(([lng, lat]) => latLngToXY({ lat, lng }, CSUB_BOUNDS))

    // Find normalized bbox (in case your bounds are slightly bigger than actual boundary)
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity

    for (const p of normalized) {
      if (p.x < minX) minX = p.x
      if (p.y < minY) minY = p.y
      if (p.x > maxX) maxX = p.x
      if (p.y > maxY) maxY = p.y
    }

    const spanX = Math.max(1e-9, maxX - minX)
    const spanY = Math.max(1e-9, maxY - minY)

    // Use ONE uniform scale so the shape never stretches
    const drawW = WORLD_W - PAD * 2
    const drawH = WORLD_H - PAD * 2
    const scale = Math.min(drawW / spanX, drawH / spanY)

    // Center the shape in the world
    const contentW = spanX * scale
    const contentH = spanY * scale
    const offsetX = (WORLD_W - contentW) / 2
    const offsetY = (WORLD_H - contentH) / 2

    return normalized
      .map(({ x, y }) => {
        const px = offsetX + (x - minX) * scale
        const py = offsetY + (y - minY) * scale
        return `${px.toFixed(2)},${py.toFixed(2)}`
      })
      .join(" ")
  }, [canvasSize])

  // Nice initial zoom so the world fits the screen
  const initialZoom = useMemo(() => {
    if (!canvasSize) return 1
    const zx = canvasSize.width / WORLD_W
    const zy = canvasSize.height / WORLD_H
    // slightly smaller so you see padding around boundary
    return Math.min(zx, zy) * 0.98
  }, [canvasSize])

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Debug header */}
      <View style={{ padding: 12 }}>
        <Text style={{ color: "#111827" }}>
          {canvasSize
            ? `Canvas: ${canvasSize.width.toFixed(0)} x ${canvasSize.height.toFixed(0)} | World: ${WORLD_W} x ${WORLD_H}`
            : "Loading..."}
        </Text>
      </View>

      <View
        style={{ flex: 1 }}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout
          setCanvasSize({ width, height })
        }}
      >
        {canvasSize && (
          <ReactNativeZoomableView
            style={{ flex: 1 }}
            initialZoom={initialZoom}
            maxZoom={6}
            minZoom={0.25}
            zoomStep={0.35}
            // IMPORTANT: allow free pan/zoom; borders can feel like "cutting"
            bindToBorders={false}
            // optional: smoother feel
            panBoundaryPadding={80}
          >
            <Svg width={WORLD_W} height={WORLD_H}>
              <Polyline
                points={pointsString}
                fill="none"
                stroke="#111827"
                strokeWidth={3}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </Svg>
          </ReactNativeZoomableView>
        )}
      </View>
    </View>
  )
}
