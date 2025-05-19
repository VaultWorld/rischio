# Guida per importare in Android Studio

Per importare questo progetto in Android Studio e creare un'app Android, segui questi passaggi:

## Preparazione

1. Assicurati di avere installato:
   - [Android Studio](https://developer.android.com/studio)
   - [JDK 11+](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)

## Passaggi per la conversione

1. **Crea una build di produzione**
   ```
   npm run build
   ```

2. **Aggiungi la piattaforma Android**
   ```
   npx cap add android
   ```

3. **Copia i file web alla piattaforma Android**
   ```
   npx cap sync android
   ```

4. **Apri il progetto in Android Studio**
   ```
   npx cap open android
   ```

## Configurazione in Android Studio

1. Una volta aperto Android Studio, attendi che finisca di indicizzare i file
2. Verifica le configurazioni del progetto in `app/build.gradle`
3. Assicurati che i file di risorse (icone, splash screen) siano correttamente configurati nella cartella `app/src/main/res`

## Personalizzazione dell'icona dell'app

1. In Android Studio, vai su `app > res > drawable`
2. Sostituisci le icone predefinite con quelle del tuo brand
3. Puoi usare [Image Asset Studio](https://developer.android.com/studio/write/image-asset-studio) integrato in Android Studio per generare tutte le dimensioni necessarie

## Test e deployment

1. Clicca su "Run" per testare l'app su un emulatore o dispositivo fisico
2. Per creare un APK per la distribuzione:
   - Menu: Build > Build Bundle(s) / APK(s) > Build APK(s)

## Note aggiuntive

- Se necessario, modifica i colori del tema Android in `app/src/main/res/values/colors.xml`
- Per personalizzare lo splash screen, modifica `app/src/main/res/values/styles.xml`
- Per funzionalità native (come notifiche), dovrai aggiungere i relativi plugin Capacitor

## Debugging

Se riscontri problemi:
1. Controlla la console di Android Studio per errori
2. Verifica che la versione del JDK sia compatibile
3. Assicurati che tutte le dipendenze di Android siano aggiornate tramite SDK Manager