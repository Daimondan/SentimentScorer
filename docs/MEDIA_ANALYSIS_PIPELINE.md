# Full Media Analysis Pipeline

## 1. Manifest

Create an ordered manifest for images, carousel children, video, cover and audio.

## 2. Acquisition

Retrieve authorized media and distinguish:

- complete;
- unavailable;
- unauthorized;
- removed;
- expired URL;
- technical failure.

A cover is not the video.

## 3. Images and carousels

For every child:

- visual description;
- product category;
- brand/logo evidence;
- OCR;
- confidence;
- child ordering.

Aggregate only after all available children are processed.

## 4. Video

- determine duration;
- sample baseline frames;
- detect scene changes;
- add frames around meaningful transitions;
- extract audio;
- transcribe with timestamps;
- run OCR on representative frames;
- attach evidence to timestamps.

## 5. Classification

Explicitly pass completeness flags. Lower confidence or route to review when material channels are missing.

## 6. Audit

Store provider, model, prompt, rule version, inputs, outputs and errors.

Never report unavailable audio as “no mention heard.”
