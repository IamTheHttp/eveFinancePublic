import React from "react";

function ConfirmLicensePurchase(props: {showConfirmBuy:boolean, confirm: (a:boolean) => void}) {
  const showConfirmBuy = props.showConfirmBuy;
  const confirm = props.confirm;

  if (!showConfirmBuy) {
    return null;
  }

  return (
    <div className={!showConfirmBuy ? 'd-none' : 'splash-popup'}>
    <div>Are you sure you want to Buy/Extend your license??</div>
    <div className='btn-group' style={{width:'100%'}}>
      <button
        style={{width:'50%'}}
        onClick={async () => {
          confirm(false);
        }}
        className='btn btn-danger'>No - Cancel!
      </button>
      <button
        style={{width:'50%'}}
        onClick={() => {
          confirm(true);
        }}
        className='btn btn-info'>Yes - Buy License
      </button>
    </div>
  </div>
  );
}

export {ConfirmLicensePurchase}