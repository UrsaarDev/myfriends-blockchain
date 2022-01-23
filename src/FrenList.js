import React, { Component } from 'react';
import iconEdit from './imgs/icon_edit_white-48dp.svg';

////
// Processing and display of the list of friends (Fren List). Includes:
//   - The ability to add a nickname to the address for ease of understanding the Fren Feed
//   - The ability to turn notifications on and off for each particular address (some friends are busier than others)
class FrenList extends Component {
	
	// Set the states for items requiring handling
	state= {showForm: false, currentFren: ""}

	// Show the update nickname input form
	showForm = () => {
	   return (
			<div id="addName">

				<form onSubmit={(event) => {
					event.preventDefault();
				}}>

					<div className="input-group mb-3">
						<input
							id="editName"
							ref={(nickname) => {
								this.nickname = nickname
							}}
							type="text" 
							className="form-control" 
							placeholder="Fren's Nickname" 
							aria-label="Fren's Nickname"
							aria-describedby="Fren's Nickname"
							required
						/>

						<div className="input-group-append">
							<input 
								type="submit" 
								value="Update" 
								className="btn btn-outline-success"
								onClick={(event) => {
									event.preventDefault()
									this.props.updateFrenName(this.state.currentFren.id, this.nickname.value)
								}}
							/>
							<button 
								class="btn btn-outline-secondary"
								type="button" 
								onClick={() => 
									this.setState({showForm: false, currentFren: ""})
								}>Cancel</button>
						</div>
					</div>

				</form>
				
			</div>
		 );
	 }
	 
	 
	// Render the friend list on a table
	render() {
		return (
			<div id="content">

				<table id="frenList" className="table table-hover table-dark">
				  <thead>
					<tr>
					  <th scope="col">#</th>
					  <th scope="col">Nickname</th>
					  <th scope="col">Address</th>
					  <th scope="col">Notify</th>
					</tr>
				  </thead>
				  <tbody>
					{ this.props.frens.map((fren, frenKey) => {
						return(
							<tr>
								<td>
									{fren.id}
								</td>
								<td>
									{this.state.showForm ? this.showForm() : null}
									<span className="nickname">
										{fren.nickname != 0 ? fren.nickname : null}
									</span>
									<img 
										src={iconEdit}
										width="24px"
										data-toggle="tooltip" 
										data-placement="left" 
										title="Click to edit your fren's nickname"
										onClick={() => 
											this.setState({showForm: true, currentFren: fren})
										}
									/>
								</td>
								<td>
									<span className="content">{fren.content} </span>
								</td>
								<td>
									<div className="frenTemplate" className="checkbox" key={frenKey}>
										<label>
										
											<input 
												type="checkbox"
												name={fren.id}
												defaultChecked={fren.notify}
												ref={(input) => {
													this.checkbox = input
												}}
												onClick={(event) => {
													
													this.props.toggleNotify(fren.id)
												}}
											/>
										</label>
									</div>
								</td>
							</tr>
						)
					})}

				  </tbody>
				</table>
				
			</div>
		);
	}
}

export default FrenList;
