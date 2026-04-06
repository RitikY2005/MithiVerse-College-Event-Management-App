import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const AnalyticsChart = ({ data, type = 'bar' }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-4 rounded-lg">
          <p className="text-white font-semibold">{payload[0].payload.name}</p>
          <p className="text-primary-400">{`Registrations: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-2xl p-6" data-aos="fade-up">
      <h3 className="text-2xl font-bold text-white mb-6 font-montserrat">Event Analytics</h3>
      <ResponsiveContainer width="100%" height={300}>
        {type === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="registrations" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity={1} />
              </linearGradient>
            </defs>
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="registrations" stroke="#8b5cf6" strokeWidth={3} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
