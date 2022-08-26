## Description

Beats with friends. A piece of software where beatmakers can make beats with each other.

[Demo](https://beat-with-friends.web.app)

## Index

- [Contributing](#contributing)
- [Building and Running](#building-and-running)
- [Stack](#stack)
- [Features](#features)

## Contributing

Please see the [contributing doc](https://github.com/aburd/beats-with-friends/blob/master/doc/CONTRIBUTING.md).

## Building and Running

Besides the commands listed here, check the package.json for others.

### Installation

```
$ git clone git@github.com:aburd/beats-with-friends.git
$ cd beats-with-friends
pnpm install
```

### Running

```
pnpm dev
```

Update the `VITE_DEBUG` var in the `.env` file for more debug information.

## Stack

### Hosting

Firebase Hosting

### Backend

- DB: Firebase Realtime DB
- Auth: Firebase Auth

### Frontend

- Build: pnpm
- View: Solid JS
- Audio: Tone.js

## Features

### Turn Mode

Each beatmaker is assigned to a group. That group can collaborate on music turn by turn.
One person works on the beat, then marks when they are finished. Then the next person works on the beat and so on.
