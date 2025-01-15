import { parseISO, formatDistanceToNow } from "date-fns";

import React from 'react'

const TimeAgo = ({timestamp}) => {
    let timeAgo = ''

    if (timestamp) {
        //parse iso string to date-fns date obj
        const date = parseISO(timestamp);
        //calculate period from date to now
        const timePeriod = formatDistanceToNow(date);
        timeAgo = `${timePeriod} ago`
    }

  return (
    <span title={timestamp}>
        &nbsp; <i>{timeAgo}</i>

    </span>
  )
}

export default TimeAgo