# Title

Beats with Friends storage notes

## Description

The below is a working document to show how the data is laid out for the Beats with Friends app.
The app will primarily use a NoSQL DB for ease of storage.
However, data with heavy reads and writes will stay flat in order to keep the UI fast.

### Problem Statement

Beats with Friends is an app where you can work on beats in realtime with other people. In order for Beats with Friends to work, we will have to be able to update many songs quickly and get realtime updates to other users in order for them to collaborate. 

## Data

### Songs

Just data representations of beats.

#### Instruments

Representations of different kinds of sounds that the Beats with Friends client can play.

#### Patterns

Are building blocks of songs. A pattern is a group of instruments and sequences (the timings for the instrument to play) play one portion of a song. 

### Users

Are the basis of our app. Users can work on and own songs and transfer that ownership of songs to groups.

### Groups

Groups are where people collaborate on songs
