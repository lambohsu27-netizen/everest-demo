import moment from 'moment';
import React from 'react';

const MyMessageDivider = ({ date }) => {
    const now = moment();
    const sendTime = moment(date);

    const formattedDate = sendTime.format('dddd, LL');
    const text = sendTime.isSame(now, 'day') ? 'Today' : formattedDate;

    return (
        <div className="flex items-center w-full gap-2 py-2.5">
            <hr className="flex-1 border-gray-light/200" />
            <p className="text-sm-medium text-gray-light/600">{text}</p>
            <hr className="flex-1 border-gray-light/200" />
        </div>
    );
};

export default MyMessageDivider;