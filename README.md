# Acquisition Portal (Portal 1) — Proof of Concept

A prototype “Deal Intelligence Cockpit” for land acquisition due diligence: consolidate spatial constraints and feasibility modelling into one interactive map + dashboard so an acquisitions manager can “test drive” a site before committing capital. :contentReference[oaicite:0]{index=0}

## Why this exists

Land acquisition decisions are often made in tight windows with incomplete information, where hidden constraints (heritage, ecology, utilities, contamination, overlays) can destroy project feasibility after purchase. :contentReference[oaicite:1]{index=1}  
This POC aims to validate the core workflow: select a site boundary → auto-scan constraints → compute developable area → run a live residual value model → export an investment-style report. :contentReference[oaicite:2]{index=2}

## Target users

-   **Primary:** Development / acquisitions managers and land buyers who need speed + accuracy. :contentReference[oaicite:3]{index=3}
-   **Secondary:** Valuers, investment committees, financiers who need defensible evidence for approvals. :contentReference[oaicite:4]{index=4}

## POC scope (what this prototype will include)

### 1) One-click Site Assessment (“Site Snapshot”)

**Goal:** enter an address / lot and instantly generate a snapshot card.

**POC workflow**

1. Search & fly to an address/lot. :contentReference[oaicite:5]{index=5}
2. Define a boundary by selecting a parcel or drawing a lasso polygon. :contentReference[oaicite:6]{index=6}
3. Auto-analyse intersecting layers within the boundary. :contentReference[oaicite:7]{index=7}

**POC outputs**

-   Zoning / planning metadata
-   Gross area, encumbered area, net developable area (NDA) :contentReference[oaicite:8]{index=8}

### 2) “Deal Killer” Scanner (red flag detection)

**Goal:** automated alerts for critical constraints that usually take specialists weeks.

POC checks will be implemented as a **rule engine** over sample constraint layers (buffer/intersection tests) and generate alerts in the UI, e.g. ecology, heritage, contamination hints, utilities distance, bushfire overlay. :contentReference[oaicite:9]{index=9}

### 3) Live Feasibility Modelling (“Yield Engine”)

**Goal:** interactive feasibility numbers that update in real-time as inputs change.

**Core calculations (POC)**

-   Lots = NDA × density :contentReference[oaicite:10]{index=10}
-   Revenue (GRV) = lots × avg lot price :contentReference[oaicite:11]{index=11}
-   Basic cost model (civil cost per lot + optional uplift factors)
-   Residual Land Value (RLV) and simple margin checks :contentReference[oaicite:12]{index=12}

### 4) Time Machine Simulator (cost of delay)

**Goal:** adjust key schedule durations and see interest/holding cost + IRR impact.

POC will include a timeline slider that modifies a holding-cost model and displays delta cost/IRR. :contentReference[oaicite:13]{index=13}

### 5) UX: “Financial cockpit” with Lens system

Dark-mode cockpit UI with “lenses” (Planning / Water / Risk) to toggle map styling and overlays. :contentReference[oaicite:14]{index=14}

### 6) Export report (POC)

A button to generate a basic PDF memo (map screenshots + snapshot + risk list + feasibility summary). :contentReference[oaicite:15]{index=15}

## Out of scope (for the POC)

-   Production-grade ingestion of “hundreds of datasets”
-   Paid/closed datasets (Nearmap, CoreLogic/PropTrack, DBYD) as hard dependencies
-   Legal-grade planning advice; this is a prototype, not a compliance tool

## Proposed technical architecture (POC-friendly)

This repo is structured as a small monorepo with a web app + API + spatial DB.

**Frontend**

-   React + Vite
-   Map rendering: MapLibre GL (or Mapbox GL) + optional Deck.gl for 3D
-   UI: Tailwind (dark mode by default)

**Backend**

-   Python FastAPI
-   Spatial ops: PostGIS (preferred for POC) via SQLAlchemy + GeoAlchemy
-   “Feasibility Agent”: Python service/module that computes RLV/IRR logic :contentReference[oaicite:16]{index=16}

**Data**

-   POC uses **seeded GeoJSON** (parcels + a handful of constraint layers).
-   Future path: replace seed layers with WFS/services and an ingestion pipeline. :contentReference[oaicite:17]{index=17}
