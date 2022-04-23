// Stupid import, webapck doesn't detect changes to interface files
import {ChangeEvent} from "react";

const tmp = require("./interfaces/IstateQuotas").IStateNewQuotas;

import * as  React from 'react';
import {IStateNewQuotas} from "./interfaces/IstateQuotas";
import SearchMarketItemInput from "../../../../components/Forms/SearchMarketItemInput";
import {SIEveMarketItem} from "../../../../Interfaces/Server/SImarketItem";
import postData from "../../../../utils/postData";


type IProps = { onChange: () => void };

class NewQuota extends React.Component<IProps, IStateNewQuotas> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      item: null,
      amount: 0
    };

    this.handleAmountChange = this.handleAmountChange.bind(this);
  }


  handleItemMatch(items: SIEveMarketItem[], exactMatch: SIEveMarketItem[]) {
    if (exactMatch) {
      this.setState({
        item: exactMatch[0]
      })
    }
  }

  handleAmountChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      amount: +e.target.value
    });
  }

  async handleFormSubmit() {
    await postData('auth/quotas', {
      amount: this.state.amount,
      typeID: this.state.item.typeID
    });

    this.props.onChange();
  }


  render() {
    return (
      <form>
        <div className='form-group'>
          <SearchMarketItemInput
            onChange={(items, exactMatch) => {
              this.handleItemMatch(items, exactMatch);
            }}
          />
        </div>

        <div className='form-group'>
          <label>
            Amount:
          </label>
          <input type='number' onChange={(e) => {
            this.handleAmountChange(e);
          }}/>
        </div>

        <div className='form-group'>
          <button
            style={{width: '100%'}}
            className='btn btn-success' onClick={(e) => {
            e.preventDefault();
            this.handleFormSubmit();
          }}>Add a job
          </button>
        </div>
      </form>
    )
  }
}

export default NewQuota;