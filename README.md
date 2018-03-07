# openvote
A MVP prototype electronic voting machine that uses proof-of-database and OpenTimestamps to detect results tampering. Votes are stored in a txt file in a mongo database and at user chosen increments of time i.e. every 10 minutes, a hash is taken of the database. The database hash at the time polls close is compared to the database hash at the time results are released to the public. Any discrepancies in hashes indicates tampering. 

Features to be included in future releases:
- Automated timer for snapshots
- Public key & signature combo to verify identity instead of "voterID"
- Twitter integration for real time hash logging during voting process 
- Mechanism to reward users for verifying transactions on the blockchain 
