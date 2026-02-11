# Telos Network Analytics Dashboard

A real-time analytics dashboard for the Telos blockchain network, inspired by gmonads.com. Features live network statistics, animated visualizations, and a dark theme with Telos brand colors.

🔗 **Live Demo**: [https://molty365.github.io/telos-network-dashboard/](https://molty365.github.io/telos-network-dashboard/)

## Features

### 🎨 Design
- **Dark Theme**: Sleek dark interface with Telos brand colors
  - Cyan: #00F2FE
  - Blue: #4FACFE  
  - Purple: #C471F5
- **Responsive Layout**: CSS Grid-based layout that works on all devices
- **Animated Globe**: 3D network visualization with CSS/Canvas animations
- **Glow Effects**: Beautiful glow and shadow effects throughout

### 📊 Live Data Metrics
- **TPS** - Transactions per second (estimated from recent blocks)
- **Block Time** - Average block time (~0.5s for Telos)
- **Gas Price** - Current gas price in Gwei
- **TLOS Price** - Real-time TLOS price from CoinGecko
- **Total Staked** - Total staked TLOS from STLOS contract
- **Market Cap** - Live market capitalization
- **Validators** - Active block producers count
- **Staking APY** - Annual percentage yield (4%)
- **Recent Blocks** - Latest blocks with transaction counts

### 📈 Sparkline Charts
Each metric includes a mini sparkline chart showing historical trends with:
- Smooth line animations
- Glow effects matching Telos brand colors
- Real-time updates every 10 seconds

## Technology Stack

### Frontend
- **Pure HTML/CSS/JS** - No frameworks, vanilla web technologies
- **CSS Grid** - Modern layout system for responsive design
- **CSS Animations** - Smooth transitions and effects
- **Canvas API** - Custom globe visualization

### Blockchain Integration
- **ethers.js** - Ethereum-compatible RPC calls to Telos network
- **Telos RPC** - Direct connection to https://rpc.telos.net
- **Smart Contracts** - Integration with STLOS staking contract

### Data Sources
- **Telos RPC** - Block data, gas prices, transaction counts
- **CoinGecko API** - TLOS price and market cap data
- **STLOS Contract** - Total staked TLOS amount
- **Network Statistics** - Validator/block producer information

## API Endpoints

### Telos Network
- **RPC**: `https://rpc.telos.net`
- **Chain ID**: 40 (Telos EVM)
- **STLOS Contract**: `0xB4B01216a5Bc8F1C8A33CD990A1239030E60C905`

### External APIs
- **CoinGecko**: `https://api.coingecko.com/api/v3/simple/price?ids=telos&vs_currencies=usd&include_market_cap=true`

## Performance Features

### Real-time Updates
- **10-second refresh** for live metrics
- **Efficient API calls** with error handling
- **Smooth animations** for data transitions
- **Loading states** with visual indicators

### Optimizations
- **Local data caching** for sparkline histories
- **Batch API calls** for better performance
- **Responsive images** and lightweight assets
- **Browser compatibility** with modern web standards

## Development

### File Structure
```
├── index.html      # Main HTML structure
├── styles.css      # Complete styling with animations
├── script.js       # JavaScript logic and API integration
└── README.md       # This documentation
```

### Key Components

#### TelosDashboard Class
- Main application controller
- Data fetching and state management
- Chart rendering and updates
- Error handling and retry logic

#### Globe Animation
- Canvas-based network visualization
- Rotating nodes and connections
- Dynamic color effects
- Responsive to container size

#### Sparkline Charts
- Real-time data visualization
- Smooth line animations
- Glow effects and styling
- Historical data tracking

## Browser Support

- **Chrome/Chromium** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+

## Contributing

This dashboard is built with modern web standards and follows best practices:

1. **Semantic HTML** for accessibility
2. **CSS Grid** for responsive layouts
3. **ES6+ JavaScript** with classes and async/await
4. **Error handling** for network failures
5. **Performance optimization** for smooth animations

## License

MIT License - Feel free to use this code for your own projects.

## Acknowledgments

- Inspired by [gmonads.com](https://gmonads.com) design
- Built for the Telos blockchain community
- Uses Telos brand guidelines and colors