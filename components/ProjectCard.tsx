import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type ProjectProps = {
  title: string;
  tasks: number;
  progress: number;
  color: string;
}

export const ProjectCard = ({ title, tasks, progress, color }: ProjectProps) => (
  <Card className={`bg-${color}-100`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Button variant="ghost" size="icon" className="h-4 w-4">...</Button>
    </CardHeader>
    <CardContent>
      <p className="text-xs text-muted-foreground">{tasks} tasks</p>
      <Progress value={progress} className="mt-2" />
    </CardContent>
  </Card>
)