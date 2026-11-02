# Play Store release checklist

Little Wild is not yet ready to submit. Work through this checklist with the actual publisher account.

1. Replace or verify the temporary synthetic teaching and effect audio; record its redistributable licence in `THIRD_PARTY.md`.
2. Test the signed release on physical Android phones: first-run microphone permission, denied permission, on-device and network speech services, no-service recovery, system bars, small screens, rotation, low memory, offline lessons, sound toggle, and accessibility settings.
3. Publish the final privacy policy at a public URL. Complete the Play Data safety form from the tested build and the real speech-provider behaviour. Configure the intended child age groups, content rating, target audience, and Families requirements.
4. Make a new app in Play Console under the publisher’s own account and application ID. Enrol in Play App Signing, protect the upload key outside this repository, build and sign an AAB, and retain the source corresponding to every release.
5. Prepare truthful store listing text, feature graphic, screenshots, support contact, and review instructions. Do not claim offline speech checking, pronunciation scoring, or data practices that have not been tested.
6. Run closed testing before production. Personal developer accounts created after 13 November 2023 generally need at least 12 opted-in testers for 14 continuous days before production access; confirm the account’s current Play Console requirements.

As of this repository update, new apps and updates must target Android API 36. See Google Play’s [target API guidance](https://support.google.com/googleplay/android-developer/answer/11926878), the [Families policy](https://support.google.com/googleplay/android-developer/answer/9893335), [target-audience and privacy guidance](https://support.google.com/googleplay/android-developer/answer/9867159), [Play App Signing](https://developer.android.com/studio/publish/app-signing), and the [testing requirement guidance](https://support.google.com/googleplay/android-developer/answer/14151465).
