'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Team } from '@/lib/types';

interface SortableTeamRowProps {
  team: Team;
  index: number;
}

function SortableTeamRow({ team, index }: SortableTeamRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: team.shortName });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Determine row styling based on position
  let rowClass = '';
  if (index < 4) {
    rowClass = 'bg-success/20'; // Top 4
  } else if (index >= 17) {
    rowClass = 'bg-error/20'; // Bottom 3
  }

  return (
    <tr ref={setNodeRef} style={style} className={rowClass}>
      <td {...attributes} {...listeners} className="cursor-move">
        <span className="text-lg">☰</span>
      </td>
      <td>{index + 1}</td>
      <td>{team.shortName}</td>
      <td>{team.name}</td>
    </tr>
  );
}

interface LeagueTableEditorProps {
  initialTeams: Team[];
  initialGamesPlayed?: number;
  initialTotalGoals?: number;
}

export default function LeagueTableEditor({ 
  initialTeams, 
  initialGamesPlayed = 0,
  initialTotalGoals = 0 
}: LeagueTableEditorProps) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [gamesPlayed, setGamesPlayed] = useState<number>(initialGamesPlayed);
  const [totalGoals, setTotalGoals] = useState<number>(initialTotalGoals);
  const [copied, setCopied] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTeams((items) => {
        const oldIndex = items.findIndex((item) => item.shortName === active.id);
        const newIndex = items.findIndex((item) => item.shortName === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update positions
        return newItems.map((item, index) => ({
          ...item,
          position: index + 1,
        }));
      });
    }
  }

  const calculateEstimatedGoals = () => {
    if (gamesPlayed === 0) return 0;
    const goalsPerGame = totalGoals / gamesPlayed;
    return Math.round(goalsPerGame * 38);
  };

  const handleSave = async () => {
    const estimatedTotalGoals = calculateEstimatedGoals();
    const leagueTableData = {
      teams: teams.map((team, index) => ({
        position: index + 1,
        shortName: team.shortName,
        name: team.name,
      })),
      gamesPlayed,
      totalGoals,
      estimatedTotalGoals,
      timestamp: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(leagueTableData, null, 2);

    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      alert('Failed to copy to clipboard. Please copy manually from the console.');
      console.log('League Table JSON:', jsonString);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box">
        <div className="card-body p-2 md:p-4">
          <h2 className="card-title mb-4">League Table</h2>
          <p className="text-sm text-base-content/70 mb-4">
            Drag and drop teams to reorder the table. Top 4 are highlighted in green, bottom 3 in red.
          </p>
          
          <div className="overflow-x-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <table className="table w-full">
                <thead>
                  <tr>
                    <th></th>
                    <th>Position</th>
                    <th>Short Name</th>
                    <th>Name</th>
                  </tr>
                </thead>
                <tbody>
                  <SortableContext
                    items={teams.map((team) => team.shortName)}
                    strategy={verticalListSortingStrategy}
                  >
                    {teams.map((team, index) => (
                      <SortableTeamRow
                        key={team.shortName}
                        team={team}
                        index={index}
                      />
                    ))}
                  </SortableContext>
                </tbody>
              </table>
            </DndContext>
          </div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl rounded-none md:rounded-box">
        <div className="card-body">
          <h2 className="card-title mb-4">Season Stats</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Games Played</span>
              </label>
              <input
                type="number"
                placeholder="0"
                className="input input-bordered"
                value={gamesPlayed}
                onChange={(e) => setGamesPlayed(parseInt(e.target.value) || 0)}
                min="0"
                max="38"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Total Goals Scored</span>
              </label>
              <input
                type="number"
                placeholder="0"
                className="input input-bordered"
                value={totalGoals}
                onChange={(e) => setTotalGoals(parseInt(e.target.value) || 0)}
                min="0"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Estimated Total Goals</span>
              </label>
              <input
                type="number"
                className="input input-bordered"
                value={calculateEstimatedGoals()}
                readOnly
                disabled
              />
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            <button
              className={`btn ${copied ? 'btn-success' : 'btn-primary'}`}
              onClick={handleSave}
            >
              {copied ? '✓ Copied to Clipboard!' : 'Save & Copy JSON'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
