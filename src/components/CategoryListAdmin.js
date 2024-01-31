import React, { Fragment, Component } from "react";
import withContext from "../withContext";
import "../index.css";
import { Link } from "react-router-dom";

class CategoryListAdmin extends Component {
  state = {
    searchQuery: "",
  };

  deleteCategory = async (categoryId) => {
    console.log("delete", categoryId);
    try {
      const response = await fetch("http://127.0.0.1:8086/api/delete-categorie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categoryId,
        }),
      });

      if (response.ok) {
        this.props.history.push('/categorieListAdmin');
          window.location.reload();
        await this.props.context.AddCategorie({
          categoryId,
        });
      } else {
        console.error("Échec de l'enregistrement", response.statusText);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error.message);
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, error: "" });
  };

  render() {
    const { categories } = this.props.context;
    const { searchQuery } = this.state;

    const filteredCategories =
      searchQuery === ""
        ? categories
        : categories.filter((category) =>
            category.Nom.toLowerCase().includes(searchQuery.toLowerCase())
          );

    return (
      <Fragment>
        <div className="hero qss">
          <div className="hero-body container">
            <div className="field has-addons">
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="rechercher"
                  name="searchQuery"
                  value={searchQuery}
                  onChange={this.handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="container">
          <div className="card">
            <div className="card-content">
              <table className="table is-striped is-fullwidth">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Description</th>
                    <th>Supprimer</th>
                    <th>Modifier</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories && filteredCategories.length ? (
                    filteredCategories.map((category, index) => (
                      <tr key={index}>
                        <td>{category.IDCategorie}</td>
                        <td>{category.Nom}</td>
                        <td>{category.Description}</td>
                        <td>
                          <button
                            className="button is-danger"
                            onClick={() => this.deleteCategory(category.IDCategorie)}
                          >
                            Supprimer
                          </button>
                        </td>
                        <td>
                          <Link
                            to={{
                              pathname: '/modifierCategorie',
                              state: { CatId: category.IDCategorie, instNom: category.Nom, instDesc: category.Description }
                            }}
                            className="button is-success"
                          >
                            Modifier
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">
                        <div className="column">
                          <span className="title has-text-grey-light">
                          Aucune catégorie trouvée !                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withContext(CategoryListAdmin);
