import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Backend from '../../apis/Backend'
import { WalletContext } from '../../context/WalletContext'

const Category = ({ categoriesList, type }) => {
    const history = useHistory()
    const [selectedCategories, setSelectedCategories] = useState([])
    const { categories, setCategories } = useContext(WalletContext)

    useEffect(()=>{
        setSelectedCategories(categoriesList.filter(category => type === category.type))
    },[categoriesList, type])

    const handleRemove = async (category) => {
        try{
            if (window.confirm(`Are you sure you want to delete category: ${category.name}`)){
                let deleteTransactions
                if (window.confirm(`Do you want to delete all the transaction under this category?`)){
                    deleteTransactions=true
                }
                else {
                    deleteTransactions=false
                }
                const request = {
                    option: 'delete',
                    deleteTransactions: deleteTransactions
                }
                await Backend.put(`/categories/${category.id}`, request)
                setCategories(categories.filter(e => e.id !== category.id))
                history.push('/home')
            }
        } catch(err){
            history.push('/session')
        }
    }

    return (
        <div className="col-md-auto">
            <h5 style={{ cursor: "pointer" }} className="h5">{ type }</h5>
            <ul>
            {selectedCategories && selectedCategories.map(category => <li style={{ cursor: "pointer" }} onClick={()=>handleRemove(category)} key={category.id}>{category.name} ({category.count})</li>)}
            </ul>
        </div>
    )
}

export default Category;