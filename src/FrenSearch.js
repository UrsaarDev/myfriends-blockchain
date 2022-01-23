import React, { Component } from 'react';

////
// Display and handling of adding a friend to the Fren List
class FrenSearch extends Component {
	
	render() {
		return (
			<div id="content">
			
				<form onSubmit={(event) => {
					event.preventDefault();
					this.props.createFren(this.fren.value);
					
				}}>

					<div className="input-group mb-3">
						<input
							id="newFren"
							ref={(input) => {
								this.fren = input
							}}
							type="text" 
							className="form-control" 
							placeholder="Fren's Wallet Address" 
							aria-label="Fren's wallet address" 
							aria-describedby="button-addon2"
							required
						/>

						<div className="input-group-append">
							<input 
								type="submit" 
								value="Follow My Fren!" 
								className="btn btn-outline-success" 
							/>
						</div>
					</div>

				</form>
				
			</div>
		);
	}
}

export default FrenSearch;
