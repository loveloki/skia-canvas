/// <reference lib="dom"/>
/// <reference types="node" />

export function loadImage(src: string | Buffer): Promise<Image>
export class DOMMatrix extends globalThis.DOMMatrix {}
export class DOMPoint extends globalThis.DOMPoint {}
export class DOMRect extends globalThis.DOMRect {}
export class Image extends globalThis.Image {}
export class ImageData extends globalThis.ImageData {}
export class CanvasGradient extends globalThis.CanvasGradient {}
export class CanvasPattern extends globalThis.CanvasPattern {}
export class CanvasTexture {}

//
// Canvas
//

export type ExportFormat = "png" | "jpg" | "jpeg" | "pdf" | "svg";

export interface RenderOptions {
  /** Page to export: Defaults to 1 (i.e., first page) */
  page?: number

  /** Background color to draw beneath transparent parts of the canvas */
  matte?: string

  /** Number of pixels per grid ‘point’ (defaults to 1) */
  density?: number

  /** Quality for lossy encodings like JPEG (0.0–1.0) */
  quality?: number

  /** Convert text to paths for PDF or SVG exports */
  outline?: boolean
}

export interface SaveOptions extends RenderOptions {
  /** Image format to use */
  format?: ExportFormat
}

export class Canvas {
  /** @internal */
  static contexts: WeakMap<Canvas, readonly CanvasRenderingContext2D[]>

  constructor(width?: number, height?: number)

  /**
   * Cast this object as a {@link SyncCanvas} and set the `async` property to false to get the synchronous behaviours.
   *
   * @example
   * import { Canvas, SyncCanvas } from "."
   * const myCanvas = new Canvas() as any as SyncCanvas
   * myCanvas.async = false
   * const result = myCanvas.toBuffer("png") // now these functions return synchronously
   */
  async: boolean
  width: number
  height: number

  getContext(type?: "2d"): CanvasRenderingContext2D
  newPage(width?: number, height?: number): CanvasRenderingContext2D
  readonly pages: CanvasRenderingContext2D[]

  saveAs(filename: string, options?: SaveOptions): Promise<void>
  toBuffer(format: ExportFormat, options?: RenderOptions): Promise<Buffer>
  toDataURL(format: ExportFormat, options?: RenderOptions): Promise<string>

  get pdf(): Promise<Buffer>
  get svg(): Promise<Buffer>
  get jpg(): Promise<Buffer>
  get png(): Promise<Buffer>
}

export type SyncCanvas = {
  [P in keyof Canvas]: Canvas[P] extends Promise<infer Value>
    ? Value // Promise getter to synchronous getter
    : Canvas[P] extends (...args: infer Args) => Promise<infer Return>
    ? (...args: Args) => Return // Async functions to sync functions
    : P extends "async"
    ? false // `async` property is now false
    : Canvas[P] // Everything else stays the same
}

//
// Context
//

type Offset = [x: number, y: number] | number

export interface CreateTextureOptions {
  path?: Path2D
  line?: number
  color?: string
  angle?: number
  offset?: Offset
}

interface CanvasFillStrokeStyles {
  fillStyle: string | CanvasGradient | CanvasPattern | CanvasTexture;
  strokeStyle: string | CanvasGradient | CanvasPattern | CanvasTexture;
  createConicGradient(startAngle: number, x: number, y: number): CanvasGradient;
  createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
  createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
  createPattern(image: CanvasImageSource, repetition: string | null): CanvasPattern | null;
  createTexture(spacing: Offset, options?: CreateTextureOptions): CanvasTexture
}

export interface CanvasRenderingContext2D extends CanvasCompositing, CanvasDrawImage, CanvasDrawPath, CanvasFillStrokeStyles, CanvasFilters, CanvasImageData, CanvasImageSmoothing, CanvasPath, CanvasPathDrawingStyles, CanvasRect, CanvasShadowStyles, CanvasState, CanvasText, CanvasTextDrawingStyles, CanvasTransform, CanvasUserInterface {
  readonly canvas: Canvas;
  fontVariant: string;
  textTracking: number;
  textWrap: boolean;
  lineDashMarker: Path2D | null;
  lineDashFit: "move" | "turn" | "follow";

  conicCurveTo(cpx: number, cpy: number, x: number, y: number, weight: number): void;
  // getContextAttributes(): CanvasRenderingContext2DSettings;

  fillText(text: string, x: number, y:number, maxWidth?: number): void;
  strokeText(text: string, x: number, y:number, maxWidth?: number): void;
  measureText(text: string, maxWidth?: number): TextMetrics;
  outlineText(text: string): Path2D;
}

//
// Bézier Paths
//

export interface Path2DBounds {
  readonly top: number
  readonly left: number
  readonly bottom: number
  readonly right: number
  readonly width: number
  readonly height: number
}

export type Path2DEdge = [verb: string, ...args: number[]]

export class Path2D extends globalThis.Path2D {
  d: string
  readonly bounds: Path2DBounds
  readonly edges: readonly Path2DEdge[]

  contains(x: number, y: number): boolean
  conicCurveTo(
    cpx: number,
    cpy: number,
    x: number,
    y: number,
    weight: number
  ): void


  complement(otherPath: Path2D): Path2D
  difference(otherPath: Path2D): Path2D
  intersect(otherPath: Path2D): Path2D
  union(otherPath: Path2D): Path2D
  xor(otherPath: Path2D): Path2D

  interpolate(otherPath: Path2D, weight: number): Path2D

  jitter(segmentLength: number, amount: number, seed?: number): Path2D

  offset(dx: number, dy: number): Path2D

  points(step?: number): readonly [x: number, y: number][]

  round(radius: number): Path2D

  simplify(rule?: "nonzero" | "evenodd"): Path2D

  transform(...args: [matrix: DOMMatrix] | [a: number, b: number, c: number, d: number, e: number, f: number]): Path2D;

  trim(start: number, end: number, inverted?: boolean): Path2D;
  trim(start: number, inverted?: boolean): Path2D;

  unwind(): Path2D
}

//
// Typography
//

export interface TextMetrics extends globalThis.TextMetrics {
  lines: TextMetricsLine[]
}

export interface TextMetricsLine {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly baseline: number
  readonly startIndex: number
  readonly endIndex: number
}

export interface FontFamily {
  family: string
  weights: number[]
  widths: string[]
  styles: string[]
}

export interface FontVariant {
  family: string
  weight: number
  style: string
  width: string
  file: string
}

export interface FontLibrary {
  families: readonly string[]
  family(name: string): FontFamily | undefined
  has(familyName: string): boolean

  use(familyName: string, fontPaths?: string | readonly string[]): FontVariant[]
  use(fontPaths: readonly string[]): FontVariant[]
  use(
    families: Record<string, readonly string[] | string>
  ): Record<string, FontVariant[] | FontVariant>
}

export const FontLibrary: FontLibrary
