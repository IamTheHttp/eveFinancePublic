import * as React from 'react';
import fetchData from "../../utils/fetchData";
import {SIEveMarketItemResponse} from "../../views/Market/interfaces/interfaces";
import {SIEveMarketItem} from "../../Interfaces/Server/SImarketItem";
import {publicConfig} from "../../../config/publicConfig";
import {debounce} from "../../utils/debounce";
import {MouseEventHandler, Ref} from "react";

interface CompState {
  exactMatchItem: SIEveMarketItem[],
  eveMarketItems: SIEveMarketItem[]
}

interface CompProps {
  onChange(eveMarketItems: SIEveMarketItem[], exactMachItem: SIEveMarketItem[]): void;
}


function RenderResults(props: { exactMatchItem: SIEveMarketItem[], eveMarketItems: SIEveMarketItem[], onItemClick:MouseEventHandler }) {
  const {exactMatchItem, eveMarketItems} = props;

  if (exactMatchItem.length === 1) {
    return null;
  }

  if (eveMarketItems.length === 0) {
    return null;
  }

  return (
    <>
      <div>Select...</div>
      {eveMarketItems.slice(0, 5).map((item) => {
        return <div
          style={{cursor: 'pointer'}}
          onClick={props.onItemClick}
          key={Math.random()}>{item.typeName}</div>
      })}

    </>)
}

class SearchMarketItemInput extends React.Component<CompProps, CompState> {
  private debouncedSearchItem: Function;
  private textInput: Ref<HTMLInputElement>;

  // or for hooks const textInput = useRef(null);

  constructor(props: CompProps) {
    super(props);
    this.textInput = React.createRef();

    this.state = {
      exactMatchItem: [],
      eveMarketItems: []
    };

    this.debouncedSearchItem = debounce(this.searchItemByName.bind(this), publicConfig.ITEM_SEARCH_DEBOUNCE_MS)
  }

  async searchItemByName(itemName: string) {
    const eveMarketItemsResponse = await fetchData<SIEveMarketItemResponse>(`auth/marketItems/${itemName}`);

    if (eveMarketItemsResponse.errorID === 0) {
      const {search, exactMatch} = eveMarketItemsResponse.data;

      this.setState({
        eveMarketItems: search,
        exactMatchItem: exactMatch
      });

      this.props.onChange(search, exactMatch);
    }
  }

  render() {
    return (
      <div className=''>
        <div className=''>
          <div className=''>
            <label>
              Item:
            </label>
            <input
              className={this.state.exactMatchItem.length > 0 ? 'item-found' : 'item-not-found'}
              ref={this.textInput}
              placeholder='Nyx...' onChange={(e) => {
              // If user deletes characters back
              if (e.target.value.length <= 2) {
                this.setState({
                  eveMarketItems: [],
                  exactMatchItem: []
                });
              }
              if (e.target.value.length > 2) {
                this.debouncedSearchItem(e.target.value);
              }
            }}/>
          </div>
        </div>

        <div className=''>
          <div className=''>
            <RenderResults
              exactMatchItem={this.state.exactMatchItem}
              eveMarketItems={this.state.eveMarketItems}
              onItemClick={(e) => {
                // Send a request, populate the state of this component as if the user searched for this term
                // @ts-ignore
                this.searchItemByName(e.target.innerHTML);
                // @ts-ignore
                // Manually update the text input value to reflect this search
                this.textInput.current.value = e.target.innerHTML;
              }}
            />

            {this.state.exactMatchItem.length === 0 && this.state.eveMarketItems.length > 6 ?
              <div>{this.state.eveMarketItems.length - 6} more</div> : null}
          </div>
        </div>
      </div>
    )
  }
}


export default SearchMarketItemInput;