# Guida per generare l'APK Android

Segui questi passaggi per generare un APK della tua applicazione "Calcolatore Interesse Rischio".

## 1. Prerequisiti

Assicurati di avere installato:
- Android Studio
- Node.js e npm
- JDK 11+

## 2. Preparazione dell'ambiente

### Installazione plugin Capacitor

Il progetto ha già installato le dipendenze di Capacitor necessarie:
- @capacitor/android
- @capacitor/core
- @capacitor/cli

### File di configurazione

Il file `capacitor.config.json` è già configurato con:
- ID applicazione: `com.replit.calcolatoreinteresserischio`
- Nome app: `Calcolatore Interesse Rischio`
- Directory web: `dist`

## 3. Creazione della build per Android

Segui questi passaggi sul tuo computer locale dopo aver scaricato il progetto:

```bash
# 1. Installa le dipendenze
npm install

# 2. Crea una build di produzione
npm run build

# 3. Inizializza Capacitor (se non già fatto)
npx cap init CalcolatoreInteresseRischio com.replit.calcolatoreinteresserischio --web-dir=dist

# 4. Aggiungi la piattaforma Android
npx cap add android

# 5. Sincronizza i file web con Android
npx cap sync android

# 6. Apri il progetto in Android Studio
npx cap open android
```

## 4. Configurazione in Android Studio

1. Aspetta che Android Studio completi l'indicizzazione dei file
2. Imposta la versione minima SDK (consigliata: API 21)
3. Configura l'icona dell'app usando le risorse in `android-resources/`
4. Personalizza i colori dell'app in `android/app/src/main/res/values/colors.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="colorPrimary">#F0B90B</color>
    <color name="colorPrimaryDark">#191326</color>
    <color name="colorAccent">#F0B90B</color>
</resources>
```

## 5. Generazione dell'APK

1. In Android Studio, vai su `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)`
2. Attendi il completamento della build
3. L'APK generato si troverà nella directory: `android/app/build/outputs/apk/debug/app-debug.apk`

## 6. Test dell'app

Per testare l'app sul tuo dispositivo:
1. Collega il dispositivo Android al computer tramite USB
2. Attiva il "Debug USB" nelle impostazioni sviluppatore del dispositivo
3. Fai clic su "Run" in Android Studio e seleziona il tuo dispositivo

## 7. Distribuzione

Per distribuire l'app:
1. Crea una versione firmata tramite `Build` > `Generate Signed Bundle / APK`
2. Segui la procedura guidata per generare un APK firmato
3. Puoi condividere l'APK firmato direttamente o caricarlo su Google Play Store

## Note importanti

- Il progetto utilizza il tema e i colori nello stile di PancakeSwap
- Assicurati di testare l'app su diversi dispositivi e dimensioni dello schermo
- Se l'app richiede l'accesso a Internet, aggiungi il permesso nel file `AndroidManifest.xml`