import React, { useState, useEffect } from 'react';
import StatusTab from '../../components/tab';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ApexChart from '../../components/charts/chart';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
import Job from '../../components/job';
import './style.scss';

export default function Footer() {
	const [time, setTime] = useState(1);
	const [sort, setSort] = useState('recent');
  const [ActiveJobData, setActiveJobData]= useState({})
	const [countReceived, setCountReceived] = useState([]);
	const [countApplied, setCountApplied] = useState([]);
  const [data, setData] = useState([]);
  const dayRange = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
  const [categoryRange, setCategoryRange] = useState([])

	const handleChange = (event) => {
		setSort(event.target.value);
		handleSorting(event.target.value)
	};
  
  useEffect(() => {
      axios.get('http://localhost:4000/api/v1/jobs').then((res)=>
       { setActiveJobData(res?.data.ActiveJobData);
        setCountReceived(res?.data?.ActiveJobData?.countPerDay?.Received)
        setCountApplied(res?.data?.ActiveJobData?.countPerDay?.Applied)
        setData(res?.data?.ActiveJobData?.jobData)
        setCategoryRange(dayRange)
      }
      ).catch ((err)=>{
      console.log("error", err)
    })},[])

	useEffect(() => {
		if (time === 0) {
			setCountReceived(ActiveJobData?.countPerDay?.Received.slice(0, 7));
			setCountApplied(ActiveJobData?.countPerDay?.Applied.slice(0, 7));
      setCategoryRange(dayRange.slice(0,7));
		} else {
			setCountReceived(ActiveJobData?.countPerDay?.Received);
			setCountApplied(ActiveJobData?.countPerDay?.Applied);
      setCategoryRange(dayRange);
		}
	}, [time]);
	const ApexChartWrapper = ({ countReceived, countApplied, categoryRange }) => {
		return <ApexChart countReceived={countReceived} countApplied={countApplied} categoryRange={categoryRange} />;
	};

	const [sortCriteria, setSortCriteria] = useState('');
	const sortData = (array, criteria) => {
		const sortedArray = [...array];
		switch (criteria) {
		case 'name':
			sortedArray.sort((a, b) => a.name.localeCompare(b.name));
			break;
		case 'recent':
			sortedArray.sort((a, b) => new Date(b.dateFormat) - new Date(a.dateFormat));
			break;
		default:
			break;
		}
		return sortedArray;
	};
	const handleSorting = (criteria) => {
		setSortCriteria(criteria);
	
		const sortedData = sortData(data, criteria);
		setData(sortedData);
	};
  return (
    <div className="home-page">
      <div className="page-header">
        <div className="container">
          <h1>Hello, Paramedic Medical Supplies</h1>
          <Button variant="contained" onClick={() => alert('Want to post a job?')}>
            Post a Job
          </Button>
          <div className="tabs">
		  	<StatusTab name="Active Jobs" count={180} />
            <StatusTab name="New Application" count={180} />
            <StatusTab name="Candidate To Be Reviewed" count={22} />
            <StatusTab name="Shortlisted" count={178} />
          </div>
        </div>
      </div>
      <div className="main-page">
        <div className="container">
          <h2>Applications Received</h2>
          <ButtonGroup variant="contained">
            <Button
              style={time === 0 ? { color: '#6390DF', fontWeight: '700', backgroundColor: '#F5F8FE' } : {}}
              onClick={() => {
                setTime(0);
              }}
            >
              Weekly
            </Button>
            <Button
              style={time === 1 ? { color: '#6390DF', fontWeight: '700', backgroundColor: '#F5F8FE' } : {}}
              onClick={() => {
                setTime(1);
              }}
            >
              Monthly
            </Button>
          </ButtonGroup>
        </div>
        <div className="container chart">
          <div className="chart-container">
			<ApexChartWrapper countReceived={countReceived} countApplied={countApplied} categoryRange = {categoryRange} />
          </div>
        </div>
        <div className="container">
          <h2>Active Jobs </h2>
          <div className="select">
            <p>Sort By: </p>
            <Select displayEmpty inputProps={{ 'aria-label': 'Without label' }} value={sort} onChange={handleChange}>
              <MenuItem value={'recent'}>Recent</MenuItem>
              <MenuItem value={'name'}>Name</MenuItem>
            </Select>
          </div>
        </div>
		<div className="container">
			<div className="jobs">
				{data?.map((item, index) => (
					<Job key={index} data={item} />
				))}
			</div>
		</div>
      </div>
    </div>
  );
}
