// Common MediaPipe FaceMesh index groups for contours and key regions.
// These are commonly-used index sets for drawing outlines and contours.
export const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];

export const LIPS = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 78, 95, 88, 178, 87];

export const LEFT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133];
export const RIGHT_EYE = [263, 249, 390, 373, 374, 380, 381, 382, 362];

export const NOSE = [1, 2, 98, 327, 168];

export const LEFT_IRIS = [474, 475, 476, 477];
export const RIGHT_IRIS = [469, 470, 471, 472];

export default { FACE_OVAL, LIPS, LEFT_EYE, RIGHT_EYE, NOSE, LEFT_IRIS, RIGHT_IRIS };
