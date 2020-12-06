import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Backend from '../../apis/Backend'
import { WalletContext } from '../../context/WalletContext'
import Category from './Category'

const Categories = () => {
    const history = useHistory()
    const { categories, setCategories } = useContext(WalletContext)

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const response = await Backend.get('/categories')
                setCategories(response.data.data)
            } catch(err){
                history.push('/session');
            }
        }
        fetchData()
    }, [history, setCategories])

    

    return (
        <div className="container">
            <div className="text-left display-4">Categories</div> <br />
            <div className="container">
                <div className="row">
                    {categories && categories.some(category => category.type === "Income") ? <div className="col col-sm"><Category categoriesList={categories} type="Income" /></div> : null}
                    {categories && categories.some(category => category.type === "Expense") ? <div className="col col-sm"><Category categoriesList={categories} type="Expense" /></div> : null}
                    {categories && categories.some(category => category.type === "Transfer") ? <div className="col col-sm"><Category categoriesList={categories} type="Transfer" /></div> : null}
                </div>
            </div>
        </div>
    )
}

export default Categories