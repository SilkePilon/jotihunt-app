Quick wins (high value, low effort)
Fox likelihood heatmap

Value: Visualize where foxes are most likely based on recent sightings/visited badges and time decay.
How: Keep a small sightings store (manual + visited toggles + timestamps) and render a Heatmap Layer with recency weights.
Candidate next-stop ranking

Value: Shows the top 3–5 groups a fox is likely to hit next.
How: Build a simple graph between nearby groups (distance matrix), score neighbors by road distance from last seen and “degree” (group density); list and highlight them.
Intercept ETA chips

Value: Quick “can we intercept?” answer for each candidate stop.
How: For your location → candidate, compute car/walk/bike ETAs (Distance Matrix); show color-coded chips on each marker.
Geofenced proximity alerts

Value: Ping when you’re within X meters of a selected group or hot area.
How: Periodic distance checks to selected markers/hulls, show toast + vibrate.
Shareable plan link

Value: Coordinate faster with other teams.
How: Encode selection, colors, route in the URL query; add “Kopieer link” button.
Tactical (medium effort)
Fox route hypotheses (k-shortest paths)

Value: See 2–3 most plausible paths between groups.
How: Build a group graph (edges where road distance < threshold) and run Yen’s k-shortest paths from last seen to multiple plausible goals; draw faint polylines.
Time slider + trail

Value: Replay how the map changed and fox movement hypotheses over time.
How: Extend archive toggle to a scrubber; cache per-timestamp groups/visited; render trails with fading opacity.
Isochrone rings (walk time contours)

Value: Visual “reachable in 10/20/30 min” around fox or you.
How: Sample spokes with walking routes, build an approximate isochrone polygon, fill with soft tint.
Multi-team coordination board

Value: Assign who covers which candidate; reduce duplicate effort.
How: Local-only to start: label chips with A/B/C and small color tags; later sync via a tiny endpoint.
Marker notes and photos

Value: Log hints/sightings per group.
How: Popover gets a “Notitie” text area and optional image upload; badge the marker when notes exist.
Advanced (bigger payoff)
Bayesian hint filters

Value: Convert vague hints (near water/rail/forest) into map constraints.
How: Toggle layers (waterways, rail, forests) and down‑weight candidate groups far from selected features; re-rank next stops.
Intercept planner

Value: Suggest rendezvous point and best approach leg for your team.
How: From fox hypothesis polyline, find closest road point with good parking/meet areas (Places: parking/poi), compute your route there, and show arrival gap.
Multi‑fox tracking

Value: Parallel hypotheses per fox team with distinct colors.
How: Separate layers/states per foxID; independent heatmaps, candidate lists, and trails.
Offline tile/cache mode

Value: Keep working with flaky cell coverage.
How: Pre-cache tiles around Gelderland and your plan route; store minimal group data in IndexedDB.
Safety overlays and quiet hours

Value: Smarter night tactics.
How: Add cycling-friendly routes, avoid motorways, visualize lit streets; adjust path scoring by hour.
Smart polish (fits your current UI)
Quick route compare

Value: Fast decision between 2 targets.
How: Multi-select two groups and render side-by-side ETA chips (car/walk/bike) and a simple “better” badge.
Compass-to-target control

Value: Navigation at a glance during movement.
How: Button shows bearing arrow from you to the focused marker; auto-updates with geolocation.
Color rules

Value: Tighter team visual language.
How: Auto-color markers by your assignment (A/B/C) or by “next stop rank”; legend in the left control card.
