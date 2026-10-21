import React from 'react';
import '../styles/History.css';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';

// 画像ファイルをインポート
import gradCapIcon from '../img/grad-cap.png';
import locationPinIcon from '../img/location-pin.png';

function History() {
  const history = [
    { date: '2000/11', icon: 'pin', text: '北海道札幌市出身' },
    { date: '2019/03', icon: 'cap', text: '市立札幌旭丘高等学校 卒業' },
    { date: '2020/04', icon: 'cap', text: '北海道大学入学 総合理系 入学' },
    { date: '2024/03', icon: 'cap', text: '北海道大学 工学部 情報エレクトロニクス学科 卒業' },
    { date: '2024/04', icon: 'cap', text: '北海道大学 大学院情報科学院 情報理工学専攻 入学' },
  ];

  return (
    <section id="history" className="history-section">
      <h2>History</h2>
      <Timeline position="right">
        {history.map((item, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot>
                <img
                  src={item.icon === 'cap' ? gradCapIcon : locationPinIcon}
                  alt={item.icon === 'cap' ? 'Graduation Cap' : 'Location Pin'}
                  className="custom-timeline-icon"
                />
              </TimelineDot>
              {index < history.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="h6" component="span" className="timeline-date">
                {item.date}
              </Typography>
              <Typography className="timeline-text">{item.text}</Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}

export default History;