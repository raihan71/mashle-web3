# Smart Contract Transactions Project

A Solidity smart contract built with Hardhat for recording and managing blockchain transactions.

## Features

- **Transaction Recording**: Add transactions to the blockchain with sender, receiver, amount, message, and keyword
- **Transaction Retrieval**: Get all transactions, transaction count, and filter by user address
- **Event Logging**: Emits Transfer events for each transaction
- **Comprehensive Testing**: Full test suite with edge cases
- **TypeScript Support**: Fully typed development environment

## Quick Start

### Installation

```bash
npm install
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm run test
```

### Start Local Network

```bash
npm run node
```

### Deploy Contract

```bash
# Deploy to local network
npm run deploy:local

# Deploy to Hardhat network
npm run deploy:hardhat
```

## Contract Functions

### `addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword)`
Adds a new transaction to the blockchain and emits a Transfer event.

### `getAllTransactions()`
Returns an array of all recorded transactions.

### `getTransactionCount()`
Returns the total number of transactions.

### `getTransactionsByAddress(address user)`
Returns all transactions where the specified address is either sender or receiver.

## Project Structure

```
├── contracts/
│   └── Transactions.sol      # Main smart contract
├── scripts/
│   ├── deploy.ts            # Deployment script
│   └── interact.ts          # Interaction examples
├── test/
│   └── Transactions.test.ts # Comprehensive test suite
├── hardhat.config.ts        # Hardhat configuration
└── tsconfig.json           # TypeScript configuration
```

## Development

### Available Scripts

- `npm run compile` - Compile smart contracts
- `npm run test` - Run test suite
- `npm run deploy:local` - Deploy to local network
- `npm run node` - Start Hardhat local node
- `npm run clean` - Clean build artifacts
- `npm run coverage` - Generate test coverage report

### Network Configuration

The project is configured for:
- **Hardhat Network** (default): Built-in network for testing
- **Localhost**: Connect to local Hardhat node (http://127.0.0.1:8545)

## Testing

The contract includes comprehensive tests covering:
- Contract deployment
- Transaction addition
- Data retrieval
- Event emission
- Edge cases (zero amounts, empty strings, etc.)

Run tests with:
```bash
npm run test
```

## Security Considerations

- The contract uses `UNLICENSED` license - update as needed for your use case
- Consider adding access controls for production deployments
- Validate input parameters in production versions
- Consider gas optimization for large-scale usage

## License

UNLICENSED - Update as needed for your project