
function $unwind(name: string, preserveNull: boolean = false) {
  if (typeof preserveNull === 'undefined') {
    return {$unwind: name};
  } else {
    return {$unwind: {path: name, preserveNullAndEmptyArrays: preserveNull}}
  }
}


export {$unwind};
