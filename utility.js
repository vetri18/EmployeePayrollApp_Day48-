//defined to put the common code of two html files here
const stringifyDate=(date)=>{
    const options={day:'numeric', month: 'long',year:'numeric'};
    const newDate= date===undefined?"undefined":new Date(Date.parse(date)).toLocaleDateString('en-GB',options);
    return newDate;
}