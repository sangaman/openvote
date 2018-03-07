function listSnapshots() {
  $.get('/snapshotlist', (snapshotList) => {
    let snapshotListHtml = '<ol>';
    $.each(snapshotList, (index, obj) => {
      snapshotListHtml += '<li>';
      snapshotListHtml += obj.filename;
      snapshotListHtml += '</li>';
    });
    $('#snapshot-list').html(snapshotListHtml);
  });
}

function verifySnapshots() {
  $.get('/verifysnapshots', (snapshotList) => {
    let snapshotListHtml = '<ol>';
    $.each(snapshotList, (index, obj) => {
      snapshotListHtml += '<li>';
      snapshotListHtml += obj.filename;
      snapshotListHtml += ' - ';
      snapshotListHtml += JSON.stringify(obj.verificationEpoch);
      snapshotListHtml += '</li>';
    });
    $('#snapshot-list').html(snapshotListHtml);
  });
}

// listSnapshots();
verifySnapshots();
