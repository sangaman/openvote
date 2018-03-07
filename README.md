# openvote
A MVP prototype electronic voting machine that uses proof-of-database and OpenTimestamps to detect vote tampering. Votes are stored in a .txt file housed in a mongo database. At user chosen increments of time i.e. every 10 minutes, the database is hashed and a snapshot is taken. The latest database hash at the time polls close is compared to the database hash at the time results are released to the public. Any discrepancies in hashes indicates tampering. 

Features to be included in future releases:
- Automated timer for snapshots
- Public key & signature combo to verify identity instead of "voterID"
- Twitter integration for real time hash publication during voting process 
- Mechanism to reward the public for verifying transactions on the blockchain (against hashes published to Twitter)
