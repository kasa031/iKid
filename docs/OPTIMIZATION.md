# Optimalisering Guide

Dette dokumentet beskriver optimaliseringsstrategier for iKid-applikasjonen.

## Ytelsesoptimalisering

### 1. Debouncing og Throttling
- Søkefunksjoner er debounced for å redusere antall filtreringer
- Scroll-events kan throttles hvis nødvendig

### 2. Memoization
- Bruk React.memo for komponenter som ikke trenger re-rendering
- Bruk useMemo og useCallback for dyre beregninger

### 3. Lazy Loading
- Last inn data kun når det trengs
- Bruk pagination for store lister

### 4. Image Optimization
- Komprimer bilder før opplasting
- Bruk thumbnail-versjoner i lister
- Lazy load bilder som ikke er synlige

## App-størrelse

### 1. Fjern ubrukte pakker
```bash
npm prune
```

### 2. Code Splitting
- Splitt kode i chunks
- Last kun nødvendig kode per skjerm

### 3. Tree Shaking
- Sørg for at bundler fjerner ubrukt kode
- Bruk named imports i stedet for default imports

### 4. Asset Optimization
- Komprimer bilder og ikoner
- Bruk vektorgrafikk når mulig
- Fjern ubrukte assets

## Memory Management

### 1. Cleanup Subscriptions
- Alltid cleanup useEffect subscriptions
- Unsubscribe fra Firebase listeners

### 2. Image Caching
- Implementer bilde-caching
- Begrens cache-størrelse

### 3. List Optimization
- Bruk FlatList med getItemLayout når mulig
- Implementer windowing for store lister

## Network Optimization

### 1. Batch Requests
- Grupper flere database-forespørsler
- Bruk Firebase batch operations

### 2. Caching
- Cache ofte brukt data lokalt
- Bruk AsyncStorage for offline-støtte

### 3. Compression
- Komprimer data før sending
- Bruk effektive dataformater

## Best Practices

1. **Profiler appen** - Bruk React Native Performance Monitor
2. **Test på ekte enheter** - Ikke bare simulatorer
3. **Overvåk ytelse** - Bruk Firebase Performance Monitoring
4. **Optimaliser bilder** - Komprimer og resize før opplasting
5. **Reduser re-renders** - Bruk React.memo og useMemo strategisk

