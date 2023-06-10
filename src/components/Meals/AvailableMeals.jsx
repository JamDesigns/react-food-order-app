import { useState, useEffect } from "react";

import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";
import useHttp from "../../hooks/use-https";
import CircleLoader from "react-spinners/CircleLoader";

import classes from "./AvailableMeals.module.css";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#53f553",
};

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const { isLoading, error, sendRequest: fetchMeals } = useHttp();

  useEffect(() => {
    const mealsList = (responseData) => {
      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }

      setMeals(loadedMeals);
    };

    fetchMeals(
      {
        url: "https://react-http-26100-default-rtdb.europe-west1.firebasedatabase.app/meals.json",
      },
      mealsList,
    );
  }, [fetchMeals]);

  const mealsList = meals.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  let content = <ul>{mealsList}</ul>;

  if (isLoading) {
    content = (
      <CircleLoader
        color={"#53f553"}
        loading={isLoading}
        cssOverride={override}
        aria-label="Loading meals..."
        data-testid="loader"
      />
    );
  }

  if (mealsList.length === 0) {
    content = <p className={classes["no-data"]}>No data has been found</p>;
  }

  if (error) {
    content = <p className={classes["text-error"]}>{error}</p>;
  }

  return (
    <section className={classes.meals}>
      <Card className="Available-Meal">{content}</Card>
    </section>
  );
};

export default AvailableMeals;
