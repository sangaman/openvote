function listSnapshots() {
  $.get('/snapshotlist', (response) => {
    let snapshotListHtml = '<ol>';
    $.each(response.snapshotList, (index, obj) => {
      snapshotListHtml += '<li>';
      snapshotListHtml += obj.fileName;
      snapshotListHtml += ' - ';
      snapshotListHtml += JSON.stringify(obj.verificationEpoch);
      snapshotListHtml += '</li>';
    });
    $('#snapshot-list').html(snapshotListHtml);
  });
}

function verifySnapshots() {
  $.get('/verifysnapshots', (response) => {
    let snapshotListHtml = '<ol>';
    $.each(response.snapshotList, (index, obj) => {
      snapshotListHtml += '<li>';
      snapshotListHtml += obj.fileName;
      snapshotListHtml += '</li>';
    });
    $('#snapshot-list').html(snapshotListHtml);
  });
}

listSnapshots();
