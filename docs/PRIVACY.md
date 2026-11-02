# Privacy draft — review before publishing

Little Wild stores stage progress and sound preferences in local browser storage on the device. It does not create user accounts and does not send progress, voice recordings, or text transcripts to a Little Wild server because this app has no server.

The microphone is used only after a child taps the speaking activity and Android permission is granted. The app sends the short live utterance to the Android speech recognizer, receives candidate letter names, decides whether one matches the displayed letter, and does not persist the audio or candidates. The device’s selected speech-recognition provider may process data differently or require a network connection; its policy controls that processing.

This is a source-repository draft, not a complete public privacy policy. Before release, publish a reviewed policy at a stable public URL, identify the actual recognizer/provider behaviour on supported devices, verify Play Data safety declarations, add maintainer contact details, and have qualified privacy/legal review for the countries and age groups served.
