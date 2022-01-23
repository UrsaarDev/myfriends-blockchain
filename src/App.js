import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import FrenList from './FrenList'
import FrenSearch from './FrenSearch'
import FrenTransactionCard from './FrenTransactionCard'

import { FREN_LIST_ABI, FREN_LIST_ADDRESS } from './config'

import logo from './imgs/logo_fmf.svg';
import best from './imgs/fren_best.svg';
import hodler from './imgs/fren_hodler.svg';
import degen from './imgs/fren_degen.svg';
import ntfOn from './imgs/icon_notifications_on-48dp.svg';
import ntfOff from './imgs/icon_notifications_off-48dp.svg';
import rvwFren from './imgs/icon_chart-48dp.svg';
import addFren from './imgs/icon_add-48dp.svg';
import cnclFren from './imgs/icon_cancel-48dp.svg';
import maticLogo from './imgs/logo_matic-network.svg';
import etherscanLogo from './imgs/etherscan-logo-light-circle.svg';
import bgTx from './imgs/background_zigzag.svg';
import bgStandard from './imgs/bg_fingerprint_dark.svg';
import bgChevron from './imgs/background_zigzag_up.svg';


import Web3 from 'web3';

////
// A dApp to follow your friend's transaction on the MATIC network
class App extends Component {

////
// Set up recurring tasks
////
	componentDidMount() {
		this.interval = setInterval(() => this.tick(), 1000);
	}

	
	componentWillUnmount() {
		clearInterval(this.interval);
	}

	async tick() {

		this.setState(state => ({
		  seconds: state.seconds - 1
		}));

		if (this.state.seconds === 0) {
			this.setState({seconds: 1});
		}
		
		if (this.state.web3enabled) {
			this.setCurrentAccount();
			this.getBlockTransactions();
		}

	}
//
////


////
// Get things initialized
////
	constructor(props) {
		super(props);
		
		this.state = {
			seconds: 1,
			account: '',
			frenCount: 0,
			frens: [],
			blocknumber: 0,
			blocktx: 0,
			frentx: [],
			firstBlockToCheck: 0,
			loading: true,
			web3enabled: false,
			web3instance: '',
			web3mumbai: '',
			data: ''
		};
		
		this.createFren = this.createFren.bind(this);
		this.updateFrenName = this.updateFrenName.bind(this);
		this.existsInList = this.existsInList.bind(this);
		this.loadFrenList = this.loadFrenList.bind(this);
		this.toggleNotify = this.toggleNotify.bind(this);
		this.toggleWallet = this.toggleWallet.bind(this);
		this.stateClear = this.stateClear.bind(this);
		this.setCurrentAccount = this.setCurrentAccount.bind(this);
		this.getBlockTransactions = this.getBlockTransactions.bind(this);
		this.processTransactions = this.processTransactions.bind(this);
		
	}


	// Allow for the state to be cleared when needed
	stateClear() {
		this.setState({
			seconds: 1,
			account: '',
			frenCount: 0,
			frens: [],
			blocknumber: 0,
			blocktx: 0,
			frentx: [],
			firstBlockToCheck: 0,
			loading: true,
			web3enabled: false,
			web3instance: '',
			web3mumbai: '',
			data: ''
		});
	}
//
////


////
// Block chain loading and transaction processing
//
	// Load data from the contract
	async loadBlockchainData () {

		const web3instance = new Web3(Web3.givenProvider || "http://localhost:8545");
		const blockNumber = await web3instance.eth.getBlockNumber();
		this.setState({blocknumber: blockNumber});

		const web3mumbai = new Web3('https://rpc-mumbai.matic.today');
		this.setState({ web3mumbai: web3mumbai });

		const ethereum = window.ethereum;
		const enabledWeb3 = await ethereum.enable();

		if (enabledWeb3) {
			
			this.setState({ web3instance: web3instance });
			this.loadFrenList(web3instance);
			this.setState({ loading: false });
			this.setState({ web3enabled: true });

		} else {

			this.setState({account: "Please connect your web3 wallet."});
			this.setState({ web3enabled: false });

		}
		
	}


	// Toggle display of contract data or clear the state if wallet is disconnected 
	toggleWallet() {

		if (this.state.web3enabled) {
			this.stateClear();
		} else {
			this.loadBlockchainData ();
		}
	}


	// Set the connected wallet as the focus for the dApp (Displays address under navbar)
	async setCurrentAccount () {
		
		const account = await this.state.web3instance.currentProvider.selectedAddress;
		const accountAddress = await account;
		this.setState({account: accountAddress});
		
	}


	// Retrieve the block transactions
	async getBlockTransactions() {
		
		var Block = await this.state.web3mumbai.eth.getBlock('latest', true);
		var data = await Block;
		
		if (this.state.blocknumber != data["number"]) {
			
			this.setState({blocknumber: data["number"]});
			var TransactionCount = await this.state.web3mumbai.eth.getBlockTransactionCount(data["number"], true);
			var transactions = await TransactionCount;
			
			if(transactions > 0) {
				
				this.setState({blocktx: data["transactions"]});
				this.processTransactions();

			} else {

				this.setState({blocktx: ''});

			}
		}
	}


	// Loop through the block transactions and include in Fren Feed if any addresses are on your Fren List
	async processTransactions() {
		
		this.state.blocktx.map((data, dataKey) => {
			this.state.frens.map((fren, id) => {

				if (fren.content === data["from"] && fren.notify || fren.content === data["to"] && fren.notify ) {
					const direction = fren.content === data["from"];
					var nicknameTX = "";
					if (fren.nickname == "0") {
						nicknameTX = "Fren";
					} else {
						nicknameTX = fren.nickname;
					}

					const newTX = {
						id: this.state.frentx.length,
						txHash: data["hash"],
						blockNumber: data["blockNumber"],
						from: data["from"],
						to: data["to"],
						value: data["value"],
						fromFren: direction,
						nickName: nicknameTX
					};
					
					const transactions = this.state.frentx;
					transactions.unshift(newTX);
					this.setState({frenttx: transactions});
				}
				
			});
			
		});
		
	}
//
////


////
// Smart Contract Interaction
////
	// Retrieve the Fren List from the chain 
	async loadFrenList (web3instance) {
			
		this.setState ({
			frenCount: 0,
			frens: []
		});

		this.setCurrentAccount();
		
		const frenList = new web3instance.eth.Contract(FREN_LIST_ABI, FREN_LIST_ADDRESS);
		this.setState({ frenList });

		const frenCount = await frenList.methods.frenCount().call();
		this.setState({ frenCount });
		for (var i = 1; i <= frenCount; i++) {
			const fren = await frenList.methods.frens(i).call();

			this.setState({
				frens: [...this.state.frens, fren]
			});
		}
	}
	
	
	// Check user entered address and add to Fren List if it is valid
	createFren(content) {

		if(this.state.web3enabled) {
			if(this.state.web3instance.utils.isAddress(content)) {

				var inList = this.existsInList(content);
				if (inList) {
					alert("You're already following that fren. Find another maybe?");
				} else {
					this.setState({ loading: true });
					this.state.frenList.methods.createFren(content).send({ from: this.state.account })
					.once('receipt', (receipt) => {
						this.loadBlockchainData ();
						this.setState({ loading: false });
					});

				}

			} else {
				alert("Please enter a valid wallet address.");
			}
		} else {
			
				alert("Please connect your wallet to use this dApp.");
			
		}
	}


	// Check to ensure user does not try to add an address already on the list
	existsInList(valueToCheck) {
		
		var returnVal = 0;
		
		this.state.frens.map((fren, frenKey) => {

			if(fren.content === valueToCheck) {
				returnVal = 1;
			}
		});
		
		return returnVal;

	}

	// Add a nickname to the address on the Fren List. Allows addresses to be easier to distinguish between
	updateFrenName(frenId, nickname) {

		this.setCurrentAccount();
		this.setState({ loading: true });
		this.state.frenList.methods.nameFren(frenId, nickname).send({ from: this.state.account })
		.once('receipt', (receipt) => {
			this.loadBlockchainData ();
			this.setState({ loading: false });
		});		
	}
	
	
	// Allow user to select if they want to be notified about transactions of specific friends
	toggleNotify(frenId) {
		this.setCurrentAccount();
		this.setState({ loading: true });
		this.state.frenList.methods.toggleNotify(frenId).send({ from: this.state.account })
		.once('receipt', (receipt) => {
			this.loadBlockchainData ();
			this.setState({ loading: false });
		});

	}
//
////


////
// The visuals consisting of
//   - A navbar
//   - Fren Search (to search for and add friend)
//   - Fred Feed (to watch friend's transactions)
//   - Fren List (to know your friends, name the addresses, and toggle notifications)
//   - Acknowledgement of use of MATIC Network for storage and smart contract integrations
////  
	render() {
		return (
			<div className="App">
				<nav id="nav" className="navbar navbar-dark bg-dark border-bottom">
					<a className="navbar-brand" href="#">
						<img src={logo} width="40" height="40" className="d-inline-block align-top" alt="" loading="lazy"/>
						<span>Follow My Frens</span>
					</a>
						{ this.state.web3enabled
							?
							<button 
								type="button" 
								onClick={this.toggleWallet}
								className="btn btn-outline-danger rounded-pill">
								Disconnect Wallet
							</button>
							:
							<button 
								type="button" 
								onClick={this.toggleWallet}
								className="btn btn-outline-success rounded-pill">
									Connect Wallet
							</button>
						}
				</nav>
						
				<div className="m-0">
				{ this.state.web3enabled
					?
						<div className="bg-dark"> 
							<span className="badge badge-success float-left text-dark">
								Connected Wallet: {this.state.account}
							</span> 
							<span className="badge float-right text-white">
								Block #{this.state.blocknumber}
							</span>
						</div>
					:
						<div hidden={true}></div>
				}
				</div>


				<div className="jumbotron bg-dark text-white">
				
					<h1>{"Hello, Fren!"}</h1>
					<p>{"Do you know a fren that's a good trader, hodler, or OG? Or maybe they're just a degen who wins big more than they lose."}</p>
					<p>{"Enter their wallet address below to see what your fren is up to!"}</p>
					
					<FrenSearch 
						createFren={this.createFren}			
					/>

					<div className="clearfix">

						<hr className="my-4 bg-light"/>

						<h2>Fren Feed</h2>
						<div id="frenFeed" className="scroll-area rounded text-white text-left m-0">
					
							{ this.state.frentx.length
								?
									<FrenTransactionCard
										frentx={this.state.frentx}
									/>
								:
									this.state.web3enabled
										?
										<p className="m-3">No transactions yet</p>
										:
										<p className="m-3">Please connect your wallet to view your fren feed.</p>
							}
						</div>
					</div>

					<hr className="my-4 bg-light"/>
					
					<h2>Fren List</h2>
					<p>{"A list of your frens. Transactions will only be tracked if the 'notify' box is checked."}</p>
					<div className="row">
						<main role="main" className="col-lg-12 d-flex justify-content-center">
							
							{ this.state.web3enabled
								?
									this.state.loading 
										?
											<div id="loader" className="text-center">
												<img src={logo} height="24px" className="App-logo" />
												<p className="text-center">Retrieving blockchain data...</p>
											</div> 
										: 
											<FrenList 
												frens={this.state.frens}
												createFren={this.createFren} 
												toggleNotify={this.toggleNotify}
												updateFrenName={this.updateFrenName}
											/>
									
								:
									<div id="nowallet" className="text-center">
										<p className="text-center">PLEASE CONNECT WALLET TO USE THIS DAPP</p>
									</div> 
							}

						</main>

					</div>
				</div>
			</div>
		);
	}
}

export default App;
