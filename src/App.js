import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [events, setEvents] = useState([]);
  const [text, setText] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  //загрузка событий при монтировании
  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  //сохранение событий в при изменении
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const addEvent = () => {
    if (text.trim() && date && time) {
      const newEvent = {
        id: Date.now(),
        text: text.trim(),
        date,
        time,
        datetime: new Date(`${date}T${time}`).getTime()
      };
      setEvents([newEvent, ...events]);
      setText('');
      setDate('');
      setTime('');
    }
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addEvent();
  };

  //сортировка по дате
  const sortedEvents = [...events].sort((a, b) => b.datetime - a.datetime);

  return (
    <div className="app">
      <header className="app-header">
        <h1>📅 Лента событий</h1>
        <p>Добавляйте и отслеживайте ваши события</p>
      </header>

      <main className="main-content">
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="text">Событие:</label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Опишите событие..."
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Дата:</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="time">Время:</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="add-button">
            ➕ Добавить событие
          </button>
        </form>

        <div className="events-list">
          <h2>Мои события ({events.length})</h2>
          {sortedEvents.length === 0 ? (
            <p className="no-events">Событий пока нет</p>
          ) : (
            sortedEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-content">
                  <h3>{event.text}</h3>
                  <div className="event-datetime">
                    <span>📅 {new Date(event.date).toLocaleDateString('ru-RU')}</span>
                    <span>⏰ {event.time}</span>
                  </div>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => deleteEvent(event.id)}
                  title="Удалить событие"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
