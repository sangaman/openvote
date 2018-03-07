# openvote
A MVP prototype electronic voting machine that uses proof-of-database and OpenTimestamps to detect vote tampering. Votes are stored in a .txt file housed in a mongo database. At chosen increments of time i.e. every 10 minutes, a snapshot of the database hash is posted to the bitcoin blockchain. The latest database hash at the time polls close is compared to the database hash at the time results are released to the public. Hash discrepancies indicate tampering. 

Features to be included in future releases:
- Automated timer for snapshots
- Public key & signature combo to verify identity instead of "voterID"
- Twitter integration for real time hash publication during voting process 
- Mechanism to reward the public for verifying transactions on the blockchain (against hashes published to Twitter)
