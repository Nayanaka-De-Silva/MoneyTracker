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
    }, [])

    

    return (
        <div className="container"> 
            <div className="text-left display-4">Categories</div>
            <p>(Click on a category to delete it)</p> <br />
            <div className="container">
                <div className="row justify-content-between">
                    {categories && categories.some(category => category.type === "Income") ? <Category categoriesList={categories} type="Income" /> : null}
                    {categories && categories.some(category => category.type === "Expense") ? <Category categoriesList={categories} type="Expense" /> : null}
                    {categories && categories.some(category => category.type === "Transfer") ? <Category categoriesList={categories} type="Transfer" />:null}
                </div>
            </div>
        </div>
    )
}

export default Categories