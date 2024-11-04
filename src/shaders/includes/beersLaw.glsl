float BeersLaw(float dist, float absorption) {
    return exp(-dist * absorption);
}