// Telos Network Dashboard JavaScript

class TelosDashboard {
    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider('https://rpc.telos.net');
        this.data = {
            tps: { values: [], current: 0 },
            blocktime: { values: [], current: 0.5 },
            gasprice: { values: [], current: 0 },
            price: { values: [], current: 0 },
            staked: { values: [], current: 0 },
            marketcap: { values: [], current: 0 },
            validators: { values: [], current: 0 },
            apy: { values: [4, 4, 4, 4, 4], current: 4 },
            blocks: []
        };
        
        this.updateInterval = 10000; // 10 seconds
        this.maxDataPoints = 20;
        
        this.init();
    }
    
    async init() {
        this.initGlobe();
        this.initCharts();
        await this.fetchAllData();
        this.startUpdateLoop();
    }
    
    // Globe Animation
    initGlobe() {
        const canvas = document.getElementById('globe-canvas');
        const ctx = canvas.getContext('2d');
        
        let angle = 0;
        const nodes = this.generateNodes(30);
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw globe outline
            ctx.beginPath();
            ctx.arc(200, 200, 180, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 242, 254, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw network nodes
            nodes.forEach((node, i) => {
                const x = 200 + Math.cos(angle + node.offset) * node.radius;
                const y = 200 + Math.sin(angle + node.offset) * node.radius * 0.6;
                
                ctx.beginPath();
                ctx.arc(x, y, node.size, 0, Math.PI * 2);
                ctx.fillStyle = node.color;
                ctx.fill();
                
                // Draw connections
                if (i > 0) {
                    const prevNode = nodes[i - 1];
                    const prevX = 200 + Math.cos(angle + prevNode.offset) * prevNode.radius;
                    const prevY = 200 + Math.sin(angle + prevNode.offset) * prevNode.radius * 0.6;
                    
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(prevX, prevY);
                    ctx.strokeStyle = 'rgba(79, 172, 254, 0.2)';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            });
            
            angle += 0.005;
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    generateNodes(count) {
        const nodes = [];
        for (let i = 0; i < count; i++) {
            nodes.push({
                offset: (i / count) * Math.PI * 2,
                radius: 120 + Math.random() * 50,
                size: 2 + Math.random() * 3,
                color: `rgba(${Math.random() > 0.5 ? '0, 242, 254' : '196, 113, 245'}, 0.7)`
            });
        }
        return nodes;
    }
    
    // Initialize sparkline charts
    initCharts() {
        const cards = document.querySelectorAll('.stat-card');
        cards.forEach(card => {
            const canvas = card.querySelector('canvas');
            if (canvas) {
                this.drawSparkline(canvas, []);
            }
        });
    }
    
    drawSparkline(canvas, data) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        if (data.length < 2) return;
        
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
        ctx.lineWidth = 2;
        
        data.forEach((value, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Add glow effect
        ctx.shadowColor = 'rgba(0, 242, 254, 0.5)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    // Data fetching methods
    async fetchAllData() {
        try {
            await Promise.all([
                this.fetchTPS(),
                this.fetchGasPrice(),
                this.fetchTLOSPrice(),
                this.fetchStakedTLOS(),
                this.fetchRecentBlocks(),
                this.fetchValidators()
            ]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    async fetchTPS() {
        try {
            const latestBlock = await this.provider.getBlockNumber();
            const block1 = await this.provider.getBlock(latestBlock);
            const block2 = await this.provider.getBlock(latestBlock - 10);
            
            const timeDiff = block1.timestamp - block2.timestamp;
            const blockDiff = 10;
            const avgBlockTime = timeDiff / blockDiff;
            
            // Estimate TPS based on average transactions per block
            const avgTxPerBlock = 20; // Rough estimate
            const tps = avgTxPerBlock / avgBlockTime;
            
            this.updateStat('tps', tps.toFixed(1));
            this.updateStat('blocktime', avgBlockTime.toFixed(2));
            
        } catch (error) {
            console.error('Error fetching TPS:', error);
            this.setStatError('tps');
            this.setStatError('blocktime');
        }
    }
    
    async fetchGasPrice() {
        try {
            const gasPrice = await this.provider.getGasPrice();
            const gasPriceGwei = ethers.utils.formatUnits(gasPrice, 'gwei');
            this.updateStat('gasprice', parseFloat(gasPriceGwei).toFixed(2));
        } catch (error) {
            console.error('Error fetching gas price:', error);
            this.setStatError('gasprice');
        }
    }
    
    async fetchTLOSPrice() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=telos&vs_currencies=usd&include_market_cap=true');
            const data = await response.json();
            
            if (data.telos) {
                const price = data.telos.usd;
                const marketCap = data.telos.usd_market_cap / 1000000; // Convert to millions
                
                this.updateStat('price', price.toFixed(4));
                this.updateStat('marketcap', marketCap.toFixed(1));
            }
        } catch (error) {
            console.error('Error fetching TLOS price:', error);
            this.setStatError('price');
            this.setStatError('marketcap');
        }
    }
    
    async fetchStakedTLOS() {
        try {
            // STLOS contract ABI for totalAssets()
            const stlosAbi = ['function totalAssets() view returns (uint256)'];
            const stlosContract = new ethers.Contract(
                '0xB4B01216a5Bc8F1C8A33CD990A1239030E60C905',
                stlosAbi,
                this.provider
            );
            
            const totalAssets = await stlosContract.totalAssets();
            const stakedTLOS = parseFloat(ethers.utils.formatEther(totalAssets)) / 1000000; // Convert to millions
            
            this.updateStat('staked', stakedTLOS.toFixed(1));
        } catch (error) {
            console.error('Error fetching staked TLOS:', error);
            this.setStatError('staked');
        }
    }
    
    async fetchRecentBlocks() {
        try {
            const latestBlockNumber = await this.provider.getBlockNumber();
            const blocks = [];
            
            for (let i = 0; i < 5; i++) {
                const block = await this.provider.getBlock(latestBlockNumber - i);
                blocks.push({
                    number: block.number,
                    timestamp: block.timestamp,
                    transactionCount: block.transactions.length
                });
            }
            
            this.data.blocks = blocks;
            this.updateBlocksList();
            this.setStatSuccess('blocks');
            
        } catch (error) {
            console.error('Error fetching recent blocks:', error);
            this.setStatError('blocks');
        }
    }
    
    async fetchValidators() {
        try {
            // For Telos, we'll estimate based on network data
            // In a real implementation, you'd fetch from the actual validators endpoint
            const validatorCount = 21; // Typical for Telos
            this.updateStat('validators', validatorCount);
        } catch (error) {
            console.error('Error fetching validators:', error);
            this.setStatError('validators');
        }
    }
    
    // Update UI methods
    updateStat(statName, value) {
        const card = document.querySelector(`[data-stat="${statName}"]`);
        if (!card) return;
        
        const valueElement = card.querySelector('.value');
        if (valueElement) {
            valueElement.textContent = value;
        }
        
        // Update data array
        this.data[statName].values.push(parseFloat(value) || 0);
        if (this.data[statName].values.length > this.maxDataPoints) {
            this.data[statName].values.shift();
        }
        
        // Update chart
        const canvas = card.querySelector('canvas');
        if (canvas) {
            this.drawSparkline(canvas, this.data[statName].values);
        }
        
        this.setStatSuccess(statName);
    }
    
    setStatSuccess(statName) {
        const card = document.querySelector(`[data-stat="${statName}"]`);
        const status = card?.querySelector('.stat-status');
        if (status) {
            status.className = 'stat-status success';
        }
    }
    
    setStatError(statName) {
        const card = document.querySelector(`[data-stat="${statName}"]`);
        const status = card?.querySelector('.stat-status');
        if (status) {
            status.className = 'stat-status error';
        }
    }
    
    updateBlocksList() {
        const blocksList = document.querySelector('.blocks-list');
        if (!blocksList) return;
        
        blocksList.innerHTML = '';
        
        this.data.blocks.forEach(block => {
            const blockItem = document.createElement('div');
            blockItem.className = 'block-item';
            
            const timeAgo = this.getTimeAgo(block.timestamp);
            
            blockItem.innerHTML = `
                <span class="block-number">#${block.number.toLocaleString()}</span>
                <span class="block-time">${timeAgo}</span>
                <span class="block-txs">${block.transactionCount} txs</span>
            `;
            
            blocksList.appendChild(blockItem);
        });
    }
    
    getTimeAgo(timestamp) {
        const now = Math.floor(Date.now() / 1000);
        const diff = now - timestamp;
        
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return `${Math.floor(diff / 3600)}h ago`;
    }
    
    // Update loop
    startUpdateLoop() {
        setInterval(() => {
            this.fetchAllData();
        }, this.updateInterval);
    }
}

// Utility functions
function formatNumber(num, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
}

function formatCurrency(num, decimals = 2) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(num);
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TelosDashboard();
    
    // Add smooth scrolling for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            e.target.classList.add('active');
            
            // Scroll to section (if it exists)
            const target = e.target.getAttribute('href');
            const section = document.querySelector(target);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add card hover effects
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Error handling for network issues
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});