function getRandomNumberBetween(min: number,max: number){
    return Math.floor(Math.random()*(max-min+1)+min);
}

export const firstPercentage = getRandomNumberBetween(0, 100)
export const secondPerentage = getRandomNumberBetween(0, 100 - firstPercentage)
export const thirdPercentage = getRandomNumberBetween(0, 100 - firstPercentage - secondPerentage)
export const fourthPercentage = 100 - firstPercentage - secondPerentage - thirdPercentage
export const maxPercentage = Math.max(firstPercentage, secondPerentage, thirdPercentage, fourthPercentage)

export const firstNonMaxPercentage = [firstPercentage, secondPerentage, thirdPercentage, fourthPercentage].find(percentage => percentage !== maxPercentage) 
export const secondNonMaxPercentage = [firstPercentage, secondPerentage, thirdPercentage, fourthPercentage].find(percentage => percentage !== maxPercentage && percentage !== firstNonMaxPercentage)  
export const thirdNonMaxPercentage = [firstPercentage, secondPerentage, thirdPercentage, fourthPercentage].find(percentage => percentage !== maxPercentage && percentage !== firstNonMaxPercentage && percentage !== secondNonMaxPercentage)  


