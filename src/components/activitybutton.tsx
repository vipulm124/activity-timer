
import type {ActivityType} from '../types';



function ActivityButton(props: ActivityType){
    const Icon = props.icon;
    return(
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* {activities.map(({ name, icon: Icon, gradient }) => ( */}
            <button
              key={props.name}
              // onClick={() => onActivitySelect(name)}
              className={`w-full group relative overflow-hidden bg-gradient-to-br ${props.gradient} rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95`}
            >
              <div className="flex flex-col items-center gap-4 text-white">
                <div className="p-4 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                    <Icon size={48} strokeWidth={1.5} />
                </div>
                <span className="text-2xl font-semibold capitalize">{props.name}</span>
              </div>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </button>
          {/* ))} */}
        </div>
    )

}

export default ActivityButton;