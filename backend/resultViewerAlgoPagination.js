  //var userData = [];
  //var meetingId = userData[0].meetingId;
  //var duration = userData[0].duration;

function paginate(originalArray, page_size, page_number) {
    var participantIdArray = [];

    for (var i = 0; i < originalArray.length; i++) {
        participantIdArray.push(userData[i].participantId);
      }

	// human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    var paginatedArray = participantIdArray.slice((page_number - 1) * page_size, page_number * page_size);

	/*console.log("Page Size: " +page_size);
	console.log("Current Page: " +page_number);
	console.log("Data to display: ");*/

	console.log(paginatedArray);
 }

  //paginate(userData, 5, 1);

  module.exports = {
	  paginate
  }