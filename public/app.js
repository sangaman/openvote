function listSnapshots() {
  $.get('/snapshotlist', (snapshotList) => {
    let snapshotsHtml = '';
    $.each(snapshotList, (index, obj) => {
      snapshotsHtml += '<tr><td>';
      if (obj.filename.startsWith('snapshot')) {
        let time = obj.filename.substring(8, 25);
        time = time.replace('T', ' ');
        snapshotsHtml += time;
        snapshotsHtml += '</td><td>';
        const votes = JSON.parse(obj.data);
        const voteCount = {
          Dewey: 0,
          Truman: 0,
        };
        for (let n = 0; n < votes.length; n += 1) {
          if (votes[n].vote === 'Truman') {
            voteCount.Truman += 1;
          } else if (votes[n].vote === 'Dewey') {
            voteCount.Dewey += 1;
          }
        }
        snapshotsHtml += `Dewey: ${voteCount.Dewey}, Truman: ${voteCount.Truman}`;
      } else {
        snapshotsHtml += 'Voter list</td><td></td>';
      }
      snapshotsHtml += '</td><td>';
      snapshotsHtml += obj.hash;
      snapshotsHtml += '</td><td></td></tr>';
    });
    $('#snapshots').html(snapshotsHtml);
  });
}

function verifySnapshots() {
  $.get('/verifysnapshots', (snapshotList) => {
    let snapshotsHtml = '';
    $.each(snapshotList, (index, obj) => {
      snapshotsHtml += '<tr><td>';
      if (obj.filename.startsWith('snapshot')) {
        let time = obj.filename.substring(8, 25);
        time = time.replace('T', ' ');
        snapshotsHtml += time;
        snapshotsHtml += '</td><td>';
        const votes = JSON.parse(obj.data);
        const voteCount = {
          Dewey: 0,
          Truman: 0,
        };
        for (let n = 0; n < votes.length; n += 1) {
          if (votes[n].vote === 'Truman') {
            voteCount.Truman += 1;
          } else if (votes[n].vote === 'Dewey') {
            voteCount.Dewey += 1;
          }
        }
        snapshotsHtml += `Dewey: ${voteCount.Dewey}, Truman: ${voteCount.Truman}`;
      } else {
        snapshotsHtml += 'Voter list</td><td></td>';
      }
      snapshotsHtml += '</td><td>';
      snapshotsHtml += obj.hash;
      snapshotsHtml += '</td><td>';
      if (obj.verificationEpoch) {
        snapshotsHtml += `Bitcoin attests data existed as of ${new Date(obj.verificationEpoch * 1000)}`;
      } else {
        snapshotsHtml += 'Timestamp cannot be verified';
      }
      snapshotsHtml += '<td></tr>';
    });
    $('#snapshots').html(snapshotsHtml);
    $( "#verify" ).removeClass( "is-loading" );
  });
}

listSnapshots();

$( "#verify" ).click(function() {
  $( "#verify" ).addClass( "is-loading" );
  verifySnapshots();
});
