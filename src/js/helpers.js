export function checkPos(num) {
	if (num > 0) {
		return " positive"
	} else if (num < 0) {
		return " negative"
	} else {
		return ""
	}
};

export function toMonth(month) {
	switch(month) {
	    case "01":
	        return "Jan"
	    case "02":
	        return "Feb"
	    case "03":
	        return "Mar"
	    case "04":
	        return "Apr"
	    case "05":
	        return "May"
	    case "06":
	        return "Jun"
	    case "07":
	        return "Jul"
	    case "08":
	        return "Aug"
	    case "09":
	        return "Sep"
	    case "10":
	        return "Oct"
	    case "11":
	        return "Nov"
	    case "12":
	        return "Dec"
	    default:
	    	return
	}
}

export function formatDate() {
	var d = new Date();
	var date = d.getFullYear() + "-"
	if(d.getMonth() < 9){
		date += "0" + (d.getMonth() + 1) + "-"
	} else {
		date += (d.getMonth() + 1) + "-"
	}
	if(d.getDate() < 9){
		date += "0" + d.getDate()
	} else {
		date += d.getDate()
	}

	return date
}