import {useState} from 'react'
import {useDispatch} from 'react-redux'
import {createAsset} from '../features/assets/assetSlice'

function AssetForm() {
    const [text,setText]=useState('');
    const dispatch = useDispatch()
    const onSubmit = e =>{
        e.preventDefault()
        dispatch(createAsset({text}));
        setText('')
    }

  return (
    <section className="form"> 
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label htmlFor="text">Asset</label>
                <input type="text" name="text" id="text" value={text} onChange={(e)=>setText(e.target.value)}></input>
            </div>

            <div className="form-group">
                <button className="btn btn-block" type="submit"> Add Asset</button>
            </div>
        </form>
    </section>
  )
}

export default AssetForm