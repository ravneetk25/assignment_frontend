import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'https://assignmentbackend-production-d8da.up.railway.app/api/';
const coins = [
  { id: 'bitcoin', name: 'Bitcoin' },
  { id: 'matic-network', name: 'Matic' },
  { id: 'ethereum', name: 'Ethereum' },
];

const CryptoStats = () => {
  const [selectedCoin, setSelectedCoin] = useState(coins[0].id);
  const [stats, setStats] = useState(null);
  const [deviation, setDeviation] = useState(null);
  const [historicalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCoin]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats
      const statsResponse = await fetch(`${API_BASE_URL}/stats?coin=${selectedCoin}`);
      if (!statsResponse.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch deviation
      const deviationResponse = await fetch(`${API_BASE_URL}/deviation?coin=${selectedCoin}`);
      if (!deviationResponse.ok) throw new Error('Failed to fetch deviation');
      const deviationData = await deviationResponse.json();
      setDeviation(deviationData.deviation);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Crypto Stats Dashboard</h1>

      <Form.Group className="mb-4">
        <Form.Select value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)}>
          {coins.map((coin) => (
            <option key={coin.id} value={coin.id}>{coin.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}

      {stats && (
        <Row className="mb-4">
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Price (USD)</Card.Title>
                <Card.Text className="h3">${stats.price.toFixed(2)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Market Cap (USD)</Card.Title>
                <Card.Text className="h3">${stats.marketCap.toLocaleString()}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>24h Change</Card.Title>
                <Card.Text className={`h3 ${stats['24hChange'] > 0 ? 'text-success' : 'text-danger'}`}>
                  {stats['24hChange'].toFixed(2)}%
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

{deviation !== null && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Standard Deviation (Last 100 records)</Card.Title>
            <Card.Text className="h3">{deviation.toFixed(2)}</Card.Text>
          </Card.Body>
        </Card>
      )}

      {historicalData.length > 0 && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Price History</Card.Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      )}

      <Button onClick={fetchData} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh Data'}
      </Button>
    </Container>
  );
};

export default CryptoStats;
