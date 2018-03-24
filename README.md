# Open Vote

[Third Place at the 2018 DC Blockchain Code-A-Thon](https://digitalchamber.org/code-a-thon-2018/)

A MVP prototype electronic voting machine that implements proof-of-database using OpenTimestamps to detect vote tampering. At chosen intervals during voting, i.e. every 10 minutes, a snapshot of the database tracking voting results is stored to a file and the hash of the file is committed to the bitcoin blockchain using the OpenTimestamps API. After polls close, the voting results, database snapshots, and hashes are released to the public. Individuals can verify that each snapshot matches its corresponding hash and that the hash was indeed committed to the blockchain when it was supposed to. Any discrepancies indicate tampering.

The current demo functionality includes a command line tool to simulate voter registration, voting, and intermittent snapshots and timestamping. It also includes a basic web interface that lists snapshots and indicates whether they can be verified by OpenTimestamps.

Features to be included in future releases:

- Automated timer for snapshots
- Public key & signature combo to verify identity instead of "voterID"
- Twitter integration for real time hash publication during voting process 
- Mechanism to reward the public for verifying transactions on the blockchain (against hashes published to Twitter)

## Installation

```bash
git clone https://github.com/sangaman/openvote.git
npm install
```

## Simulating Snapshots

This repository includes a set of timestamped database snapshots for demonstration purposes. However, you can create your own demo data. This requires a running local [MongoDB](https://docs.mongodb.com/manual/administration/install-community) server without password protection. The commands below will create a collection of 50 uniquely identified voters, snapshot the list of voters, then perform random voting in five batches of 10 votes with snapshots and timestamps in between each batch. Note that if you want to ensure that each snapshot is linked to a different time and block, you should space these commands at least 30 minutes apart.

```bash
node lib/ovcli.js register 50
node lib/ovcli.js vote 10
node lib/ovcli.js vote 10
node lib/ovcli.js vote 10
node lib/ovcli.js vote 10
node lib/ovcli.js vote 10
```

## Running the Web Interface

You can start the server for the web interface on port 80 with the following command.

```bash
node lib/ovserver.js
```

The web interface will be accessible at http://127.0.0.1.
