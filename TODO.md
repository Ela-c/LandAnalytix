[x] Add a address search engine. Users should be able to search a real address and get transported to it

[x] Add button to draw a polygon on the map. After drawing the polygon show a pop up to prompt the user for more information about the parcel. The drawing should be snapped automatically to fences and roads. (They don't snap automatically, is this important enough to reseach about it?)

[] Add 3D layer to the map. Show buildings and land in 3D. (Nearmap? Yeah nearmap offers 3D maps. Price?)

[] On selecting a parcel, automatically analyse all the risks, legal area, etc. and show them.

X = estimated price (will guide developers on how much to bid for the parcel)
I(t) = ongoing interest rate for the land.
T(t) = ongoing tax percentage for the land.
what is tax and what is interest in this case? Both are functions of t, where t is the time passed after buying the land

Time Cost = Y(t) = I(t) + T(t) (This will cut the profits the more time passes)

Feature D -> Calculate cost of Planning approvals. Planning approvals take a time d to complete. The more time they take, the more money is lost in Y(t).

So Cost of Planning approvals = Y(t) where t is the estimated time taken by the council to approve the plan.

So Project Profit would be updated to be Project Profit - Cost of Planning approvals.

Are planning approvals the only thing taking time? or is there any other blocking processes.

NEXT FEATURES:
[] matchesSearch function: Consider more advanced matching (e.g., fuzzy search) if needed in the future
