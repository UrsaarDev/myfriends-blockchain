import React from 'react';
import outbound from './imgs/icon_outbound-48dp.svg';
import bgTx from './imgs/background_zigzag.svg';


////
// Processing and display of a friend's transaction on a card in the Fren Feed
// Includes a link of the transaction on MATIC's Mumbai TestNet
class FrenTransactionCard extends React.Component{

   render(){

		const frenTX = this.props.frentx;
        return(
 			
			frenTX.map((tx, id)=>{
				return(
				
					<div className="card m-3">
						<div className="card-body">
							{ tx["fromFren"] &&
								<h5 className="card-title">From {tx["nickName"]}</h5>
							}
							{ !tx["fromFren"] &&
								<h5 className="card-title">To {tx["nickName"]}</h5>
							}
							<a 
								className="float-right btn-outline-success rounded-circle" 
								href={"https://explorer-mumbai.maticvigil.com/tx/" + tx["txHash"]} 
								target="_blank">
									<img 
										src={outbound} 
										data-toggle="tooltip" 
										data-placement="left" 
										title="See tx in Block Explorer"/>
							</a>
							<p className="card-text muted">{tx["from"]} -> {tx["to"]}</p>
							<span className="card-text muted">Block #{tx["blockNumber"]}</span>
							<p className="card-text muted">Value: {tx["value"]}</p>

						</div>
					</div>
				)
				
			})
		)
   }

}

export default FrenTransactionCard;
